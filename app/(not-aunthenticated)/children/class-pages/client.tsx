'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { CLASS_PAGES_CONTENT } from '@/content/class-pages';
import type { PublicClass } from './actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';

type Props = {
  classes: PublicClass[];
};

export default function ClassPagesContent({ classes }: Props) {
  const { language } = useLanguage();
  const content = CLASS_PAGES_CONTENT;

  const titleKey = language === 'uk' ? 'pageTitleUk' : 'pageTitle';
  const descKey = language === 'uk' ? 'pageDescriptionUk' : 'pageDescription';
  const viewLabel = language === 'uk' ? content.viewClassLabelUk : content.viewClassLabel;
  const noClasses = language === 'uk' ? content.noClassesUk : content.noClasses;

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 p-8 text-center text-muted-foreground">
        <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>{noClasses}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => {
          const title = language === 'uk' && cls.title_uk ? cls.title_uk : cls.title;
          const description =
            language === 'uk' && cls.description_uk
              ? cls.description_uk
              : cls.description ?? '';

          return (
            <li key={cls.id}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="pt-6 pb-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
                  {description ? (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {description}
                    </p>
                  ) : null}
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/children/class-pages/${cls.id}`} className="gap-2">
                      {viewLabel}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
