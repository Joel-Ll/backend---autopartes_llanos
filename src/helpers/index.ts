
export const normalizeName = (name: string): string | null => {
  const normalized = name.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
  return normalized.length > 0 ? normalized : null;
}
