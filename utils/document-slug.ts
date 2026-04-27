type DocumentSlugInput = {
  id: string;
  title: string;
};

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'h',
  ґ: 'g',
  д: 'd',
  е: 'e',
  є: 'ye',
  ж: 'zh',
  з: 'z',
  и: 'y',
  і: 'i',
  ї: 'yi',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ь: '',
  ю: 'yu',
  я: 'ya'
};

function transliterate(value: string) {
  return value
    .toLowerCase()
    .split('')
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join('');
}

export function createDocumentSlug({ id, title }: DocumentSlugInput) {
  const slug = transliterate(title)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

  return slug || id;
}
