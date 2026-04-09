const indiaDayFormatter = new Intl.DateTimeFormat('en-CA', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
});

const indiaShortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  timeZone: 'Asia/Kolkata',
});

const indiaLongDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
  month: 'short',
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
});

export function toIndiaDayKey(value: string | Date) {
  const parts = indiaDayFormatter.formatToParts(new Date(value));
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';

  return `${year}-${month}-${day}`;
}

export function formatIndiaShortDate(value: string | Date) {
  return indiaShortDateFormatter.format(new Date(value));
}

export function formatIndiaLongDate(value?: string | Date) {
  if (!value) {
    return 'No updates yet';
  }

  return indiaLongDateFormatter.format(new Date(value));
}

export function getLatestEntryPerIndiaDay<T extends { created_at: string }>(entries: T[], limit = 7) {
  const seenDays = new Set<string>();

  return [...entries]
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime())
    .filter((entry) => {
      const dayKey = toIndiaDayKey(entry.created_at);

      if (seenDays.has(dayKey)) {
        return false;
      }

      seenDays.add(dayKey);
      return true;
    })
    .slice(0, limit)
    .reverse();
}
