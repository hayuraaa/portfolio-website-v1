/** Fixed list so the filter stays tidy; this order is also the order of the filter tabs. */
export const PROJECT_CATEGORIES = ["Web Application", "Mobile App", "AI & Data", "Research"] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
