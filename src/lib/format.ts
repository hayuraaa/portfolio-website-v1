const monthFormat = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

/** "2025-07" -> "Jul 2025" */
export function formatMonth(value: string | null) {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return null;
  return monthFormat.format(new Date(`${value}-01T00:00:00Z`));
}

const dayFormat = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2025-06-12" -> "Jun 12, 2025" */
export function formatDay(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return dayFormat.format(new Date(`${value}T00:00:00Z`));
}
