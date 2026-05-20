'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { WHOS_WHO_CONTENT } from '@/content/whos-who';
import type { PublicTeacher } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';

function DecorativeFloral() {
  return (
    <div className="absolute -bottom-1 left-0 right-0 flex justify-between pointer-events-none overflow-visible">
      <svg
        className="w-14 h-14 -ml-2 text-ukraine-blue/50"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <ellipse cx="16" cy="50" rx="10" ry="8" opacity="0.7" transform="rotate(-20 16 50)" />
        <circle cx="28" cy="52" r="6" opacity="0.4" />
      </svg>
      <svg
        className="w-12 h-12 text-amber-300/50"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <ellipse cx="32" cy="55" rx="8" ry="6" opacity="0.6" />
      </svg>
      <svg
        className="w-14 h-14 -mr-2 text-ukraine-yellow/60"
        viewBox="0 0 64 64"
        fill="currentColor"
      >
        <ellipse cx="48" cy="50" rx="10" ry="8" opacity="0.7" transform="rotate(20 48 50)" />
        <circle cx="36" cy="52" r="6" opacity="0.4" />
      </svg>
    </div>
  );
}

type ProfileCardProps = {
  teacher: PublicTeacher;
  aboutMeLabel: string;
  compact?: boolean;
};

function ProfileCard({ teacher, aboutMeLabel, compact }: ProfileCardProps) {
  const { language } = useLanguage();
  const name = language === 'uk' && teacher.name_uk ? teacher.name_uk : teacher.name;
  const title =
    language === 'uk' && teacher.title_uk
      ? teacher.title_uk
      : (teacher.title ?? '');
  const initials = (name.split(' ').map((n) => n[0]) || ['?']).join('').slice(0, 2);

  return (
    <Card className="relative overflow-visible rounded-xl border shadow-md">
      <CardContent className="pt-6 pb-8 flex flex-col items-center text-center">
        <Avatar
          className={cn(
            'mb-4 ring-2 ring-muted',
            compact ? 'h-24 w-24' : 'h-28 w-28'
          )}
        >
          {teacher.photoUrl ? (
            <AvatarImage
              src={teacher.photoUrl}
              alt={name}
              className="object-cover object-top"
            />
          ) : null}
          <AvatarFallback className="rounded-full bg-primary/10 text-primary text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <h3 className={cn('font-semibold leading-snug font-display text-foreground', 'mb-1')}>{name}</h3>
        <p className="mb-4 min-h-10 leading-snug text-muted-foreground">
          {title}
        </p>
        <Button variant="secondary" size="sm" className="rounded-lg" asChild>
          <Link href={`/about/whos-who/${teacher.id}`}>{aboutMeLabel}</Link>
        </Button>
        <DecorativeFloral />
      </CardContent>
    </Card>
  );
}

type WhosWhoContentProps = {
  teachers: PublicTeacher[];
};

export default function WhosWhoContent({ teachers }: WhosWhoContentProps) {
  const { language } = useLanguage();
  const content = WHOS_WHO_CONTENT;
  const aboutMeLabel = language === 'uk' ? content.aboutMeButtonUk : content.aboutMeButton;
  const coreTeamTitle = language === 'uk' ? content.coreTeamTitleUk : content.coreTeamTitle;

  const featured = teachers.filter((t) => t.category === 'HEADTEACHER');
  const coreTeam = teachers.filter((t) => t.category !== 'HEADTEACHER');

  if (teachers.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        {language === 'uk' ? 'Команда скоро буде додана.' : 'Team will be added soon.'}
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {featured[0] ? (
        <div className="flex justify-center mb-12">
          <div className="w-full max-w-md">
            <ProfileCard teacher={featured[0]} aboutMeLabel={aboutMeLabel} />
          </div>
        </div>
      ) : null}

      {coreTeam.length > 0 && (
        <>
          <h2 className="mb-8 max-md:text-2xl font-bold tracking-tight md:text-h2 font-display text-foreground text-center">{coreTeamTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreTeam.map((teacher) => (
              <ProfileCard
                key={teacher.id}
                teacher={teacher}
                aboutMeLabel={aboutMeLabel}
                compact
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
