// build-data.ts
import { mkdir } from "node:fs/promises";

const GITHUB_TOKEN = process.env.PERSONAL_GITHUB_TOKEN;
const USERNAME = "JaberChowdhury";

// Fail immediately if no token is found
if (!GITHUB_TOKEN) {
  console.error("❌ CRITICAL ERROR: PERSONAL_GITHUB_TOKEN is missing.");
  process.exit(1);
}

const query = `
  query {
    user(login: "${USERNAME}") {
      repositories(first: 100, privacy: PUBLIC, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          name
          description
          url
          homepageUrl
          stargazerCount
          updatedAt
          defaultBranchRef {
            name
          }
          repositoryTopics(first: 10) {
            nodes {
              topic {
                name
              }
            }
          }
          languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;

async function buildPortfolioAPI() {
  // Ensure directories exist before writing so local testing doesn't crash
  await mkdir("./api/readmes", { recursive: true });

  console.log("Fetching repository metadata via GraphQL...");

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  // Strict Failure 1: HTTP Error (e.g., 500 Internal Server Error, 401 Unauthorized)
  if (!response.ok) {
    console.error(
      `❌ CRITICAL ERROR: API responded with status ${response.status}`,
    );
    process.exit(1);
  }

  const result = await response.json();

  // Strict Failure 2: GraphQL Specific Errors (Query typos, permissions)
  if (result.errors) {
    console.error(
      "❌ CRITICAL ERROR: GraphQL returned errors:",
      JSON.stringify(result.errors, null, 2),
    );
    process.exit(1);
  }

  const { data } = result;

  // Format the metadata
  const repos = data.user.repositories.nodes.map((repo: any) => ({
    name: repo.name,
    description: repo.description,
    githubUrl: repo.url,
    liveUrl: repo.homepageUrl,
    stars: repo.stargazerCount,
    lastUpdated: repo.updatedAt,
    defaultBranch: repo.defaultBranchRef?.name || "main",
    topics: repo.repositoryTopics.nodes.map((t: any) => t.topic.name),
    languages: repo.languages.nodes.map((l: any) => l.name),
  }));

  // Save the master list
  await Bun.write("./api/repos.json", JSON.stringify(repos, null, 2));
  console.log(`✅ Successfully saved master list: ${repos.length} repos.`);

  console.log("Fetching README files...");

  // Fetch READMEs sequentially to prevent network race conditions/dropped connections
  for (const repo of repos) {
    const rawUrl = `https://raw.githubusercontent.com/${USERNAME}/${repo.name}/refs/heads/${repo.defaultBranch}/README.md`;

    try {
      const res = await fetch(rawUrl);
      if (res.ok) {
        const markdown = await res.text();
        await Bun.write(`./api/readmes/${repo.name}.md`, markdown);
        console.log(`  ➔ Saved README for ${repo.name}`);
      } else {
        console.log(
          `  ➔ No README found for ${repo.name} (Status: ${res.status})`,
        );
      }
    } catch (error) {
      console.error(`  ➔ Failed to fetch README for ${repo.name}`);
    }
  }

  console.log("🎉 Portfolio data generation complete!");
}

buildPortfolioAPI().catch((err) => {
  // Strict Failure 3: Unhandled script crashes
  console.error("❌ FATAL SCRIPT ERROR:", err);
  process.exit(1);
});
