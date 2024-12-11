export function getTodayStartAndEndDate(): { startDate: Date; endDate: Date } {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

export function getTodayStartAndEndMonth(): {
  startMonth: Date;
  endMonth: Date;
} {
  const now = new Date();

  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  const endMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  return { startMonth, endMonth };
}
