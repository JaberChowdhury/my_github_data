import { mkdir } from "node:fs/promises";

const GITHUB_TOKEN = process.env.PERSONAL_GITHUB_TOKEN;
const USERNAME = "JaberChowdhury";

if (!GITHUB_TOKEN) {
  console.error("❌ CRITICAL ERROR: PERSONAL_GITHUB_TOKEN is missing.");
  process.exit(1);
}

const extMap: Record<string, string> = {
  // Web & UI
  ".js": "JavaScript",
  ".cjs": "JavaScript",
  ".mjs": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "React",
  ".jsx": "React",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".astro": "Astro",
  ".html": "HTML",
  ".css": "CSS",
  ".scss": "SCSS",
  ".sass": "Sass",
  ".less": "Less",
  // Systems & High Performance
  ".c": "C",
  ".h": "C/C++ Header",
  ".cpp": "C++",
  ".hpp": "C++ Header",
  ".rs": "Rust",
  ".go": "Go",
  ".zig": "Zig",
  ".asm": "Assembly",
  // Scripting & Shell
  ".py": "Python",
  ".lua": "Lua",
  ".sh": "Shell",
  ".bash": "Bash",
  ".zsh": "Zsh",
  ".fish": "Fish",
  ".bat": "Batch",
  ".ps1": "PowerShell",
  // Backend & Mobile
  ".java": "Java",
  ".cs": "C#",
  ".kt": "Kotlin",
  ".swift": "Swift",
  ".php": "PHP",
  ".dart": "Dart",
  ".sql": "SQL",
  // Data, Config & Shader
  ".json": "JSON",
  ".yml": "YAML",
  ".yaml": "YAML",
  ".toml": "TOML",
  ".md": "Markdown",
  ".wgsl": "WebGPU",
  ".glsl": "GLSL",
  ".dockerfile": "Dockerfile",
  ".env": "Config",
};

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  default_branch?: string;
  fork?: boolean;
  topics: string[];
  size: number;
  open_issues_count: number;
}

interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface GitHubBranch {
  name: string;
  commit?: { sha: string; url: string };
  protected?: boolean;
  languages?: Record<string, number>;
  recentCommits?: CommitData[];
}

interface BranchData {
  name: string;
  readmeHtml: string;
}
interface LanguageStats {
  [language: string]: number;
}

interface CombinedRepo extends Repository {
  branches: GitHubBranch[];
  readmes: BranchData[];
  languages: LanguageStats;
  weeklyActivity: number[];
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function processRepository(repo: any): Promise<CombinedRepo> {
  const baseRepo: Repository = {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
    description: repo.description,
    homepage: repo.homepage,
    stargazers_count: repo.stargazers_count,
    watchers_count: repo.watchers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    default_branch: repo.default_branch,
    fork: repo.fork,
    topics: repo.topics || [],
    size: repo.size || 0,
    open_issues_count: repo.open_issues_count || 0,
  };

  const repoUrl = `https://api.github.com/repos/${USERNAME}/${repo.name}`;

  const [branchRes, langRes, statsRes, readmeRes] = await Promise.allSettled([
    fetch(`${repoUrl}/branches`, { headers }),
    fetch(`${repoUrl}/languages`, { headers }),
    fetch(`${repoUrl}/stats/participation`, { headers }),
    baseRepo.default_branch
      ? fetch(`${repoUrl}/readme?ref=${baseRepo.default_branch}`, {
          headers: { ...headers, Accept: "application/vnd.github.v3.html" },
        })
      : Promise.resolve(null),
  ]);

  let branches: GitHubBranch[] = [];
  if (branchRes.status === "fulfilled" && branchRes.value.ok) {
    const rawBranches = await branchRes.value.json();
    branches = rawBranches.map((b: any) => ({
      name: b.name,
      commit: { sha: b.commit.sha, url: b.commit.url },
      protected: b.protected,
    }));
  }

  let languages: LanguageStats = {};
  if (langRes.status === "fulfilled" && langRes.value.ok)
    languages = await langRes.value.json();

  let weeklyActivity: number[] = [];
  if (
    statsRes.status === "fulfilled" &&
    statsRes.value.ok &&
    statsRes.value.status === 200
  ) {
    const statsData = await statsRes.value.json();
    weeklyActivity = statsData.owner || [];
  }

  const readmes: BranchData[] = [];
  if (
    readmeRes.status === "fulfilled" &&
    readmeRes.value &&
    readmeRes.value.ok
  ) {
    readmes.push({
      name: baseRepo.default_branch as string,
      readmeHtml: await readmeRes.value.text(),
    });
  }

  if (branches.length > 0) {
    const branchChunks = chunkArray(branches, 3);
    for (const chunk of branchChunks) {
      await Promise.all(
        chunk.map(async (branch) => {
          if (!branch.commit?.sha) return;

          try {
            const [treeRes, commitRes] = await Promise.allSettled([
              fetch(`${repoUrl}/git/trees/${branch.commit.sha}?recursive=1`, {
                headers,
              }),
              fetch(`${repoUrl}/commits?sha=${branch.commit.sha}&per_page=5`, {
                headers,
              }),
            ]);

            if (treeRes.status === "fulfilled" && treeRes.value.ok) {
              const treeData = await treeRes.value.json();
              const branchLanguages: Record<string, number> = {};
              for (const file of treeData.tree || []) {
                if (file.type === "blob") {
                  const match = file.path.match(/\.[0-9a-z]+$/i);
                  if (match && extMap[match[0].toLowerCase()]) {
                    const langName = extMap[match[0].toLowerCase()];
                    branchLanguages[langName] =
                      (branchLanguages[langName] || 0) + 1;
                  }
                }
              }
              branch.languages = branchLanguages;
            }

            if (commitRes.status === "fulfilled" && commitRes.value.ok) {
              const rawCommits = await commitRes.value.json();
              branch.recentCommits = rawCommits.map((c: any) => ({
                sha: c.sha,
                message: c.commit.message,
                author: c.commit.author?.name || "Unknown",
                date: c.commit.author?.date || "",
                url: c.html_url,
              }));
            }
          } catch (err) {}
        }),
      );
    }
  }

  return { ...baseRepo, branches, readmes, languages, weeklyActivity };
}

async function buildPortfolioAPI() {
  await mkdir("./api", { recursive: true });
  console.log("Fetching main repository list...");

  const repoRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    { headers },
  );
  if (!repoRes.ok) throw new Error(`Failed to fetch repos: ${repoRes.status}`);

  const rawRepos = await repoRes.json();
  const finalData: CombinedRepo[] = [];

  const repoChunks = chunkArray(rawRepos, 5);

  for (let i = 0; i < repoChunks.length; i++) {
    const chunk = repoChunks[i];
    console.log(
      `-> Processing batch ${i + 1} of ${repoChunks.length} (${chunk.length} repos)...`,
    );

    const chunkResults = await Promise.all(
      chunk.map((repo) => processRepository(repo)),
    );
    finalData.push(...chunkResults);

    if (i < repoChunks.length - 1) {
      await Bun.sleep(1500);
    }
  }

  await Bun.write("./api/portfolio.json", JSON.stringify(finalData, null, 2));
  console.log(
    `\n✅ Complete! Saved ${finalData.length} repos to api/portfolio.json`,
  );
}

buildPortfolioAPI().catch((err) => {
  console.error("❌ FATAL ERROR:", err);
  process.exit(1);
});
