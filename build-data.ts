import { mkdir } from "node:fs/promises";

const GITHUB_TOKEN = process.env.PERSONAL_GITHUB_TOKEN;
const USERNAME = "JaberChowdhury";

if (!GITHUB_TOKEN) {
  console.error("❌ CRITICAL ERROR: PERSONAL_GITHUB_TOKEN is missing.");
  process.exit(1);
}

// --- CORE INTERFACES ---
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

interface GitHubBranch {
  name: string;
  commit?: { sha: string; url: string };
  protected?: boolean;
}

interface BranchData {
  name: string;
  readmeHtml: string;
}

// --- STATS & COMMITS INTERFACES ---
interface LanguageStats {
  [language: string]: number;
}

interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

// --- FINAL COMBINED OBJECT ---
interface CombinedRepo extends Repository {
  branches: GitHubBranch[];
  readmes: BranchData[];
  languages: LanguageStats;
  recentCommits: CommitData[];
  weeklyActivity: number[];
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
    console.log(`\nProcessing: ${repo.name}...`);

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

    // 1. Fetch Branches
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

    // 2. Fetch HTML Readme
    const readmes: BranchData[] = [];
    if (baseRepo.default_branch) {
      const readmeRes = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/readme?ref=${baseRepo.default_branch}`,
        {
          headers: {
            ...headers,
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

    // 3. Fetch Language Stats
    const langRes = await fetch(
      `https://api.github.com/repos/${USERNAME}/${repo.name}/languages`,
      { headers },
    );
    let languages: LanguageStats = {};
    if (langRes.ok) {
      languages = await langRes.json();
    }

    // 4. Fetch Recent Commits (Top 5)
    let recentCommits: CommitData[] = [];
    if (baseRepo.default_branch) {
      const commitRes = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/commits?sha=${baseRepo.default_branch}&per_page=5`,
        { headers },
      );

      if (commitRes.ok) {
        const rawCommits = await commitRes.json();
        recentCommits = rawCommits.map((c: any) => ({
          sha: c.sha,
          message: c.commit.message,
          author: c.commit.author?.name || "Unknown",
          date: c.commit.author?.date || "",
          url: c.html_url,
        }));
      }
    }

    // 5. Fetch 52-Week Activity Sparkline (Single Pass)
    let weeklyActivity: number[] = [];
    try {
      const statsRes = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/stats/participation`,
        { headers },
      );

      if (statsRes.ok && statsRes.status === 200) {
        const statsData = await statsRes.json();
        weeklyActivity = statsData.owner || [];
      } else if (statsRes.status === 202) {
        console.log(
          `  ℹ️ GitHub is calculating stats. Will populate on next Action run.`,
        );
      }
    } catch (err) {
      console.error(`  ⚠️ Network error fetching activity stats.`);
    }

    // Combine it all
    finalData.push({
      ...baseRepo,
      branches,
      readmes,
      languages,
      recentCommits,
      weeklyActivity,
    });
  }

  // Save the massive combined JSON file
  await Bun.write("./api/portfolio.json", JSON.stringify(finalData, null, 2));
  console.log(
    `\n✅ Complete! Saved ${finalData.length} repos to api/portfolio.json`,
  );
}

buildPortfolioAPI().catch((err) => {
  console.error("❌ FATAL ERROR:", err);
  process.exit(1);
});
