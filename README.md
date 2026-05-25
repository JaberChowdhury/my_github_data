# my_github_data

## colected datas type

```typescript
// The root type for the array in portfolio.json is CombinedRepo[]

export interface CombinedRepo extends Repository {
  branches: GitHubBranch[];
  readmes: BranchData[];
  languages: LanguageStats;
  recentCommits: CommitData[];
  weeklyActivity: number[]; // Array of 52 integers representing commits per week
}

export interface Repository {
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
  updated_at: string; // ISO 8601 Date string
  pushed_at: string; // ISO 8601 Date string
  default_branch?: string;
  fork?: boolean;
  topics: string[]; // Array of repository tags (e.g., ["react", "vite"])
  size: number; // Size in KB
  open_issues_count: number;
}

export interface GitHubBranch {
  name: string;
  commit?: {
    sha: string;
    url: string;
  };
  protected?: boolean;
}

export interface BranchData {
  name: string; // Usually "main" or "master"
  readmeHtml: string; // Raw HTML string of the repository's README
}

export interface LanguageStats {
  [language: string]: number; // e.g., { "TypeScript": 45000, "HTML": 1200 } (Values are in bytes)
}

export interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string; // ISO 8601 Date string
  url: string; // Direct link to the commit on GitHub
}
```
