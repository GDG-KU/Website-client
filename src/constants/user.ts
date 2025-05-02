export const ROLE_LIST = ["Core", "Member", "Junior"] as const;
export type Role = (typeof ROLE_LIST)[number];

export const POSITION_LIST = ["FE", "BE", "AI", "DSGN", "DevRel"] as const;
export type Position = (typeof POSITION_LIST)[number];
