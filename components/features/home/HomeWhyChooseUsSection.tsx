'use client';

import Image from 'next/image';
import { CARD_SURFACE_CLASSNAME } from '@/components/ui/card';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import type { HomeContent } from '@/types';

export function HomeWhyChooseUsSection({
  whyChooseUs
}: {
  whyChooseUs: HomeContent['whyChooseUs'];
}) {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="-mx-4 w-[calc(100%+(--spacing(8)))] max-w-none scroll-mt-24 md:-mx-6 md:w-[calc(100%+(--spacing(12)))] lg:-mx-8 lg:w-[calc(100%+(--spacing(16)))]"
    >
      <div className="flex flex-col items-center px-4 text-center md:px-6 lg:px-8">
        <div className="relative mb-4 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/home/hero-card-1.png"
            alt=""
            width={48}
            height={48}
            className="relative z-10 h-10 w-10 object-contain"
          />
          <TextHighlightUnderline className="bottom-0 h-2 w-24" />
        </div>
        <h2
          id="why-choose-us-heading"
          className="mx-auto max-w-3xl text-center font-display text-2xl font-bold leading-tight tracking-tight text-foreground md:text-4xl"
        >
          {whyChooseUs.heading}
        </h2>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 md:px-6 lg:grid-cols-4 lg:gap-6 lg:px-8">
        {whyChooseUs.cards.map((card, index) => (
          <article
            key={`${card.title}-${index}`}
            className={`flex h-full flex-col items-center overflow-hidden text-center ${CARD_SURFACE_CLASSNAME}`}
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden sm:h-16">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col px-5 pb-8">
              <h3 className="font-bold leading-snug text-foreground">{card.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
