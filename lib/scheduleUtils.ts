/**
 * Determines whether a class should be shown based on its start date.
 *
 * The API returns `classDate` as a bracket-wrapped, comma-separated string of dates,
 * e.g. `"[1 May 2026],[10 Apr 2026]"` or `"[14 Apr 2026],[15 Apr 2026]"`.
 * Dates may not be in chronological order, so all dates are parsed and sorted
 * before picking the earliest one as the class start date.
 *
 * A class is considered future if its earliest date is strictly after today
 * (i.e. tomorrow or later). Today's classes and past classes are excluded.
 *
 * @param classDate - The raw classDate string from the API response.
 * @returns `true` if the class starts tomorrow or later, `false` otherwise.
 *
 * @example
 * isClassInFuture("[10 Apr 2026]")              // false if today >= 10 Apr 2026
 * isClassInFuture("[1 May 2026],[10 Apr 2026]") // uses 10 Apr as start date
 * isClassInFuture("[13 Jan 2026],[18 Jan 2025]") // uses 18 Jan 2025 as start date
 */
export function isClassInFuture(classDate: string): boolean {
  const dates = classDate
    .split(",")
    .map((d) => new Date(d.replace(/[\[\]]/g, "").trim()))
    .sort((a, b) => a.getTime() - b.getTime());
  const earliest = dates[0];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return earliest.getTime() > today.getTime();
}
