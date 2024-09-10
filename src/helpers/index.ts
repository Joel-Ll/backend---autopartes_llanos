
export const normalizeName = (name: string): string | null => {
  const normalized = name.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : null;
}

export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const THRESHOLD_LOW = 20;