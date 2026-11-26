const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats "YYYY", "YYYY-MM" or "YYYY-MM-DD" without time zones ("Mar 2024",
 * "5 Mar 2024"). Anything else (free text like "2021 – 2023") is returned as is.
 */
export function formatDate(value: string): string {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(value);
  if (!m) return value;
  const [, year, month, day] = m;
  if (!month) return year;
  const name = MONTHS[Number(month) - 1] ?? month;
  return day ? `${Number(day)} ${name} ${year}` : `${name} ${year}`;
}

/** "Mar 2023 – Present"; undefined when no start date is known. */
export function formatDateRange(start?: string, end?: string): string | undefined {
  if (!start) return undefined;
  const to = end === undefined ? undefined : end === 'present' ? 'Present' : formatDate(end);
  return to ? `${formatDate(start)} – ${to}` : formatDate(start);
}
