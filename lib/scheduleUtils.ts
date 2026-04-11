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
/**
 * Sorts the `classDate` and `timing` fields of a schedule item chronologically.
 *
 * Both fields are bracket-wrapped comma-separated strings that correspond positionally:
 * - `classDate`: `"[1 May 2026],[10 Apr 2026]"`
 * - `timing`:    `"[Day 1 (08:00am to 05:00pm)],[Day 2 (08:00am to 05:00pm)]"`
 *
 * Dates may arrive out of order from the API. This function pairs each date with its
 * corresponding timing, sorts by date ascending, then reconstructs both strings so the
 * UI always displays sessions in chronological order.
 *
 * @param item - A schedule item with `classDate` and `timing` string fields.
 * @returns A new item with `classDate` and `timing` sorted chronologically.
 *
 * @example
 * sortScheduleItem({ classDate: "[1 May 2026],[10 Apr 2026]", timing: "[Day 1],[Day 2]", ... })
 * // → { classDate: "[10 Apr 2026],[1 May 2026]", timing: "[Day 2],[Day 1]", ... }
 */
export function sortScheduleItem<T extends { classDate: string; timing: string }>(item: T): T {
  const dates = item.classDate.split(",").map((d) => d.trim());
  const timings = item.timing.split(",").map((t) => t.trim());

  const paired = dates.map((d, i) => ({
    date: d,
    timing: timings[i] ?? "",
    ms: new Date(d.replace(/[\[\]]/g, "").trim()).getTime(),
  }));

  paired.sort((a, b) => a.ms - b.ms);

  return {
    ...item,
    classDate: paired.map((p) => p.date).join(","),
    timing: paired.map((p) => p.timing).join(","),
  };
}

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
