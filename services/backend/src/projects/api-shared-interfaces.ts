export interface RepoBranch {
  name: string;
  commitSha: string;
}

export interface RepoCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}
