const monthLabels = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export const getDateKey = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export const getTodayInRecife = () => getDateKey(new Date());

export const getDateParts = (date: string) => {
  const [year, month, day] = date.split("-");
  return {
    day,
    month: monthLabels[Number(month) - 1] ?? "",
    year,
  };
};

export const getShortWeekday = (weekday: string) =>
  weekday.replace(/-feira/i, "").slice(0, 3).toLowerCase();

export const splitEventsByDate = <T extends { date: string }>(
  events: T[],
  today: string
) => ({
  upcoming: events.filter((event) => event.date >= today),
  past: events.filter((event) => event.date < today).reverse(),
});
