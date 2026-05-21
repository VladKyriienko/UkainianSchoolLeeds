'use client';

import Link from 'next/link';
import { useLanguage } from '@/providers/language-provider';
import { CLASS_PAGES_CONTENT } from '@/content/class-pages';
import type { PublicClass } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight } from 'lucide-react';
import { isHtmlContent } from '@/utils/rich-text';
import { createDocumentSlug } from '@/utils/document-slug';

type Props = {
  classes: PublicClass[];
};

export default function ClassPagesContent({ classes }: Props) {
  const { language } = useLanguage();
  const content = CLASS_PAGES_CONTENT;

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
          const slug = createDocumentSlug({ id: cls.id, title: cls.title });

          return (
            <li key={cls.id} className="h-full">
              <Card className="flex h-full flex-col overflow-hidden">
                {cls.photoUrl ? (
                  <div className="aspect-video w-full shrink-0 overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cls.photoUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <CardContent className="flex flex-1 flex-col pt-4 pb-6">
                  <div className="mt-auto flex flex-col">
                    <h3 className="mb-2 line-clamp-2 font-display font-semibold leading-snug text-foreground">
                      {title}
                    </h3>
                    {description ? (
                      isHtmlContent(description) ? (
                        <div
                          className="rich-text-preview mb-4"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ) : (
                        <p className="mb-4 line-clamp-3 text-muted-foreground">
                          {description}
                        </p>
                      )
                    ) : null}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Link
                        href={`/parents/class-pages/${slug}`}
                        className="gap-2"
                      >
                        {viewLabel}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
