import { cn } from '@/utils/cn';
import { TEXT_HIGHLIGHT_UNDERLINE_SRC } from './home-constants';

type TextHighlightUnderlineProps = {
  className?: string;
  fullWidth?: boolean;
};

export function TextHighlightUnderline({ className, fullWidth }: TextHighlightUnderlineProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={TEXT_HIGHLIGHT_UNDERLINE_SRC}
      alt=""
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-0 object-contain mix-blend-multiply dark:mix-blend-screen',
        fullWidth
          ? 'bottom-0 left-0 right-0 h-3 w-full max-h-4 object-cover object-center'
          : '-bottom-1 left-1/2 h-2.5 w-[min(110%,14rem)] -translate-x-1/2 sm:h-3',
        className
      )}
    />
  );
}
