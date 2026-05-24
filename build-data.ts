// build-data.ts
import { mkdir } from "node:fs/promises";

const GITHUB_TOKEN = process.env.PERSONAL_GITHUB_TOKEN;
const USERNAME = "JaberChowdhury";

if (!GITHUB_TOKEN) {
  console.error("❌ CRITICAL ERROR: PERSONAL_GITHUB_TOKEN is missing.");
  process.exit(1);
}

// 1. Define your exact interfaces
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
}

interface GitHubBranch {
  name: string;
  commit?: { sha: string; url: string };
  protected?: boolean;
}

interface BranchData {
  name: string;
  readmeHtml: string;
}

// The final combined object
interface CombinedRepo extends Repository {
  branches: GitHubBranch[];
  readmes: BranchData[];
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

async function buildPortfolioAPI() {
  await mkdir("./api", { recursive: true });
  console.log("Fetching main repository list...");

  // Fetch all repos (up to 100)
  const repoRes = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100`,
    { headers },
  );
  if (!repoRes.ok) throw new Error(`Failed to fetch repos: ${repoRes.status}`);
  const rawRepos = await repoRes.json();

  const finalData: CombinedRepo[] = [];

  // Loop through each repo sequentially to respect rate limits
  for (const repo of rawRepos) {
    console.log(`Processing: ${repo.name}...`);

    // Extract only the fields you requested for the base Repository interface
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
    };

    // Fetch branches for this repo
    const branchRes = await fetch(
      `https://api.github.com/repos/${USERNAME}/${repo.name}/branches`,
      { headers },
    );
    let branches: GitHubBranch[] = [];
    if (branchRes.ok) {
      const rawBranches = await branchRes.json();
      branches = rawBranches.map((b: any) => ({
        name: b.name,
        commit: { sha: b.commit.sha, url: b.commit.url },
        protected: b.protected,
      }));
    }

    // Fetch HTML Readme for the default branch
    // Note: We are fetching just the default branch to keep the JSON size manageable,
    // but storing it in the BranchData array exactly as requested.
    const readmes: BranchData[] = [];
    if (baseRepo.default_branch) {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/readme?ref=${baseRepo.default_branch}`,
        {
          headers: {
            ...headers,
            // This special header tells GitHub to return HTML instead of JSON!
            Accept: "application/vnd.github.v3.html",
          },
        },
      );

      if (readmeRes.ok) {
        const readmeHtml = await readmeRes.text();
        readmes.push({
          name: baseRepo.default_branch,
          readmeHtml: readmeHtml,
        });
      }
    }

    // Combine it all
    finalData.push({
      ...baseRepo,
      branches,
      readmes,
    });
  }

  // Save the massive combined JSON file
  await Bun.write("./api/portfolio.json", JSON.stringify(finalData, null, 2));
  console.log(
    `✅ Complete! Saved ${finalData.length} repos to api/portfolio.json`,
  );
}

buildPortfolioAPI().catch((err) => {
  console.error("❌ FATAL ERROR:", err);
  process.exit(1);
});
