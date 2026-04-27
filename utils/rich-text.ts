export function isHtmlContent(content: string | null | undefined): boolean {
  if (!content) return false;
  return /<\/?[a-z][\s\S]*>/i.test(content);
}
