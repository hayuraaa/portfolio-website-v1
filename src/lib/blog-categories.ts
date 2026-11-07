/** Fixed list; this order is also the order of the filter tabs. */
export const BLOG_CATEGORIES = ["Tech", "Personal"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
