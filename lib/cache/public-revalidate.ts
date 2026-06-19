import { updateTag } from 'next/cache';

/** Bust unstable_cache entries for the public home page and related lists. */
export function revalidatePublicHomeData(...tags: string[]) {
  updateTag('public-home');
  for (const tag of tags) {
    updateTag(tag);
  }
}
