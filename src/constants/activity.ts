export const ACTIVITY_LIST = ["fetch", "worktree", "branch", "solution challenge"] as const;
export type Activity = (typeof ACTIVITY_LIST)[number];
