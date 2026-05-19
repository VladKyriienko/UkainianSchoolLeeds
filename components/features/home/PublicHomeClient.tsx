'use client';

import { useMemo } from 'react';
import { HomeNewsEventsSection } from '@/components/common/HomeNewsEventsSection';
import { HOME_CONTENT } from '@/content/home';
import { useLanguage } from '@/providers/language-provider';
import type { PublicHomeClientProps } from '@/types';
import { HomeAboutSection } from './HomeAboutSection';
import { HomeFaqSection } from './HomeFaqSection';
import { HomeHeroSection } from './HomeHeroSection';
import { HomeLeadCtaSection } from './HomeLeadCtaSection';
import { HomeProgramsSection } from './HomeProgramsSection';
import { HomeSchoolAtmosphereSection } from './HomeSchoolAtmosphereSection';
import { HomeWhyChooseUsSection } from './HomeWhyChooseUsSection';
import { ParentVoicesCarousel } from './ParentVoicesCarousel';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import { useHomeAuthHashRedirect } from './useHomeAuthHashRedirect';

/** Public marketing home page (`/`). Sections use `HOME_CONTENT[language]`; news from `initialNews`; parent voices from `parentVoices`. */
export function PublicHomeClient({
  initialNews,
  initialEvents,
  atmosphereGalleryImages,
  parentVoices
}: PublicHomeClientProps) {
  const { language } = useLanguage();
  const content = HOME_CONTENT[language];
  const isUk = language === 'uk';

  useHomeAuthHashRedirect();

  const parentVoiceCarouselItems = useMemo(() => {
    if (parentVoices.length === 0) return [];
    return parentVoices.map((r) => ({
      quote: isUk && r.content_uk?.trim() ? r.content_uk : r.content,
      attribution: isUk && r.perens_uk?.trim() ? r.perens_uk : r.perens
    }));
  }, [parentVoices, isUk]);

  const showSchoolAtmosphere = atmosphereGalleryImages.length > 0;

  const atmosphereStripImages = atmosphereGalleryImages.map((p) => ({
    key: p.id,
    src: p.src,
    alt: isUk && p.altUk ? p.altUk : p.altEn
  }));

  return (
    <div className="flex w-full min-w-0 flex-col pt-8 gap-12 pb-12 text-foreground md:gap-24">
      <HomeHeroSection
        content={{
          hero: content.hero,
          heroTrust: content.heroTrust,
          features: content.features
        }}
      />

      <HomeWhyChooseUsSection whyChooseUs={content.whyChooseUs} />

      <HomeProgramsSection programs={content.programs} />

      <HomeAboutSection about={content.about} />

      {showSchoolAtmosphere ? (
        <HomeSchoolAtmosphereSection
          images={atmosphereStripImages}
          content={content.schoolAtmosphere}
          isUk={isUk}
        />
      ) : null}

      <HomeNewsEventsSection
        initialNews={initialNews}
        initialEvents={initialEvents}
        content={content.news}
        isUk={isUk}
      />

      {parentVoices.length > 0 ? (
        <section
          id="parent-voices"
          aria-labelledby="parent-voices-heading"
          className="scroll-mt-24"
        >
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="flex flex-wrap items-end justify-center">
              <h2
                id="parent-voices-heading"
                className="font-display inline-flex max-w-4xl flex-wrap items-center justify-center gap-x-1 text-2xl font-bold leading-tight text-foreground md:text-4xl"
              >
                <span>{content.parentVoices.titleBefore}</span>
                <span className="relative inline-block">
                  {content.parentVoices.titleHighlight}
                  <TextHighlightUnderline />
                </span>
                <span>{content.parentVoices.titleAfter}</span>
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/home/hero-card-1.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 -translate-y-4 -translate-x-1.5 rotate-12 object-contain"
              />
            </div>
          </div>
          <ParentVoicesCarousel items={parentVoiceCarouselItems} />
        </section>
      ) : null}

      <HomeFaqSection faq={content.faq} />

      <HomeLeadCtaSection cta={content.cta} />
    </div>
  );
}
