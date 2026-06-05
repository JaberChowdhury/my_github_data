import { mkdir } from "node:fs/promises";
import path from "node:path";

const GITHUB_TOKEN = process.env.PERSONAL_GITHUB_TOKEN;
const SOURCE_OWNER = "JaberChowdhury";
const SOURCE_REPO = "Obsidian_repo";
const SOURCE_DIR = "blogs"; // The root folder in your private repo
const OUTPUT_DIR = "./pages/blogs"; // Where Nextra expects your files

if (!GITHUB_TOKEN) {
  console.error("❌ CRITICAL ERROR: PERSONAL_GITHUB_TOKEN is missing.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// --- HELPERS ---

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function formatDate(dateString: string) {
  return new Date(dateString).toISOString();
}

function injectNextraFrontmatter(
  rawContent: string,
  filename: string,
  meta: any,
) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = rawContent.match(frontmatterRegex);

  let existingFrontmatter = "";
  let body = rawContent;

  if (match) {
    existingFrontmatter = match[1] + "\n";
    body = rawContent.replace(frontmatterRegex, "").trim();
  }

  // Clean filename for the title (e.g., "my-post.md" -> "My Post")
  const fallbackTitle = filename
    .replace(/\.md$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const newFrontmatter = `---
title: "${fallbackTitle}"
author: "${meta.author}"
date: "${meta.createdAt}"
updatedAt: "${meta.updatedAt}"
${existingFrontmatter}---`;

  return `${newFrontmatter}\n\n${body}`;
}

// --- MAIN PROCESSOR ---

async function processBlogFile(file: any) {
  try {
    // 1. Fetch raw markdown and commit history concurrently
    const [contentRes, commitsRes] = await Promise.all([
      fetch(
        `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/contents/${file.path}`,
        {
          headers: { ...headers, Accept: "application/vnd.github.v3.raw" },
        },
      ),
      fetch(
        `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/commits?path=${file.path}`,
        {
          headers,
        },
      ),
    ]);

    if (!contentRes.ok || !commitsRes.ok)
      throw new Error("Failed to fetch data");

    const rawMarkdown = await contentRes.text();
    const commits = await commitsRes.json();

    if (!commits || commits.length === 0) {
      console.warn(`  ⚠️ No commits found for ${file.path}. Skipping.`);
      return;
    }

    // Index 0 is the newest (updated), last index is the oldest (created)
    const latestCommit = commits[0];
    const firstCommit = commits[commits.length - 1];

    const metadata = {
      author: firstCommit.commit.author?.name || "Jaber Chowdhury",
      createdAt: formatDate(firstCommit.commit.author.date),
      updatedAt: formatDate(latestCommit.commit.author.date),
    };

    // 2. Format content
    // Extract just the filename from the path for the title generator
    const filename = path.basename(file.path);
    const nextraReadyContent = injectNextraFrontmatter(
      rawMarkdown,
      filename,
      metadata,
    );

    // 3. Replicate the folder structure locally
    // file.path looks like: "blogs/2026/tech/post.md"
    // We strip the base "blogs/" so it maps cleanly to OUTPUT_DIR
    const relativePath = file.path.replace(new RegExp(`^${SOURCE_DIR}/`), "");
    const outputPath = path.join(OUTPUT_DIR, relativePath);

    // Ensure the nested directories exist locally before writing
    await mkdir(path.dirname(outputPath), { recursive: true });

    // 4. Save the file
    await Bun.write(outputPath, nextraReadyContent);
    console.log(`  ✅ Synced: ${relativePath}`);
  } catch (error) {
    console.error(`  ❌ Error processing ${file.path}`);
  }
}

async function syncBlogs() {
  console.log(
    `🔍 Mapping folder tree for: ${SOURCE_OWNER}/${SOURCE_REPO}/${SOURCE_DIR}`,
  );

  // 1. Determine the default branch dynamically
  const repoRes = await fetch(
    `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}`,
    { headers },
  );
  if (!repoRes.ok)
    throw new Error(`Failed to access repo. Token might lack permissions.`);
  const repoInfo = await repoRes.json();
  const defaultBranch = repoInfo.default_branch || "main";

  // 2. Fetch the flat, recursive tree in ONE single API call
  const treeRes = await fetch(
    `https://api.github.com/repos/${SOURCE_OWNER}/${SOURCE_REPO}/git/trees/${defaultBranch}?recursive=1`,
    { headers },
  );
  if (!treeRes.ok) throw new Error("Failed to fetch repository tree.");
  const treeData = await treeRes.json();

  // 3. Filter for markdown files that live inside our target folder
  const markdownFiles = treeData.tree.filter(
    (node: any) =>
      node.type === "blob" &&
      node.path.startsWith(`${SOURCE_DIR}/`) &&
      node.path.endsWith(".md"),
  );

  console.log(
    `📂 Found ${markdownFiles.length} markdown files across nested folders.\n`,
  );

  // 4. Process concurrently in safe chunks
  const chunks = chunkArray(markdownFiles, 5); // Process 5 files at a time

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`-> Processing batch ${i + 1} of ${chunks.length}...`);

    // Process all 5 files in the chunk simultaneously
    await Promise.all(chunk.map(processBlogFile));

    // Debounce to respect GitHub's Secondary Rate Limit
    if (i < chunks.length - 1) {
      await Bun.sleep(1000);
    }
  }

  console.log(
    `\n🎉 Success! Folder structure mirrored and metadata injected for Nextra.`,
  );
}

syncBlogs().catch((err) => {
  console.error("❌ FATAL ERROR:", err);
  process.exit(1);
});
