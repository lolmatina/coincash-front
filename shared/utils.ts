export function formatPercentage(
  value: number,
  isRaw: boolean = false
): string {
  if (isRaw) {
    (value * 100).toFixed(2);
  }
  return value.toFixed(2);
}

export function formatAmount(value: number): string {
  return value.toLocaleString("ru-RU");
}
