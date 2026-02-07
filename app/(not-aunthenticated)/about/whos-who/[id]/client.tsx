'use client';

import { useLanguage } from '@/providers/language-provider';
import { WHOS_WHO_CONTENT } from '@/content/whos-who';
import type { PublicTeacher } from '../actions';

type Props = {
  teacher: PublicTeacher;
};

function DecorativeIcon() {
  return (
    <div className="mt-8 flex justify-end">
      <svg
        className="w-16 h-16 text-ukraine-blue/40"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <circle cx="20" cy="45" r="8" opacity="0.6" />
        <circle cx="35" cy="50" r="6" opacity="0.5" />
        <circle cx="48" cy="42" r="7" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function MemberDetailClient({ teacher }: Props) {
  const { language } = useLanguage();
  const inspiresTitle =
    language === 'uk' ? WHOS_WHO_CONTENT.inspiresTitleUk : WHOS_WHO_CONTENT.inspiresTitle;
  const description = teacher.description;
  const placeholder =
    language === 'uk' ? WHOS_WHO_CONTENT.bioPlaceholderUk : WHOS_WHO_CONTENT.bioPlaceholder;
  const name = teacher.name;
  const initials = (teacher.name.split(' ').map((n) => n[0]) || ['?']).join('').slice(0, 2);

  return (
    <div className="max-w-3xl mx-auto">
      <hr className="border-border mb-8" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Portrait - left, rectangular */}
        <div className="md:w-48 shrink-0">
          {teacher.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teacher.photoUrl}
              alt={name}
              className="w-full aspect-[3/4] object-cover rounded-lg"
            />
          ) : (
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <span className="text-4xl font-semibold text-primary/60">{initials}</span>
            </div>
          )}
        </div>

        {/* Description - right of image / full width below on mobile */}
        <div className="flex-1 min-w-0">
          {description ? (
            <section>
              <h3 className="font-bold text-foreground mb-3">{inspiresTitle}:</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </section>
          ) : (
            <p className="text-muted-foreground italic">{placeholder}</p>
          )}
        </div>
      </div>

      <DecorativeIcon />
    </div>
  );
}
