export function clampScrollLeft(root: HTMLDivElement, left: number): number {
  const max = Math.max(0, root.scrollWidth - root.clientWidth);
  return Math.min(max, Math.max(0, left));
}

export function scrollSlideIntoView(
  root: HTMLDivElement,
  slide: HTMLElement,
  align: 'center' | 'start',
  behavior: ScrollBehavior = 'smooth'
): void {
  const rootRect = root.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const slideLeftInScroller = slideRect.left - rootRect.left + root.scrollLeft;
  const target =
    align === 'center'
      ? slideLeftInScroller - (root.clientWidth - slideRect.width) / 2
      : slideLeftInScroller;
  root.scrollTo({ left: clampScrollLeft(root, Math.round(target)), behavior });
}
