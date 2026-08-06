export const padTwoDigits = (value: number) => String(value).padStart(2, '0');

export const parseLocalDate = (value: string) => new Date(`${value}T00:00:00`);

export const toLocalIsoDate = (date: Date) =>
  `${date.getFullYear()}-${padTwoDigits(date.getMonth() + 1)}-${padTwoDigits(date.getDate())}`;

export const toLocalIsoDateParts = (year: number, month: number, day: number) =>
  `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`;

export const addLocalDays = (value: string, amount: number) => {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + amount);
  return toLocalIsoDate(date);
};
