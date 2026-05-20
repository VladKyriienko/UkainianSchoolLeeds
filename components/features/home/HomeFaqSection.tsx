'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CARD_SURFACE_STATIC_CLASSNAME } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { TextHighlightUnderline } from './TextHighlightUnderline';
import type { HomeContent } from '@/types';

export function HomeFaqSection({ faq }: { faq: HomeContent['faq'] }) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 overflow-visible">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,12rem)_1fr] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,14rem)_1fr]">
        <h2
          id="faq-heading"
          className="font-display text-2xl font-bold leading-tight text-foreground md:text-4xl mt-auto mb-auto lg:max-w-[14ch]"
        >
          <span className="inline-flex flex-wrap items-center gap-x-1">
            <span>{faq.titleBefore}</span>
            <span className="relative inline-block">
              {faq.titleHighlight}
              <TextHighlightUnderline />
            </span>
            <span>{faq.titleAfter}</span>
          </span>
        </h2>

        <Accordion
          type="single"
          collapsible
          className="relative isolate grid w-full grid-cols-1 gap-3 overflow-visible md:grid-cols-2 md:gap-x-6 md:gap-y-3"
        >
          {faq.items.map((item, index) => (
            <AccordionItem
              key={item.question}
              value={`faq-${index}`}
              className={cn(
                CARD_SURFACE_STATIC_CLASSNAME,
                'relative z-0 overflow-visible border-0 data-[state=open]:z-30'
              )}
            >
              <AccordionTrigger className="px-4 py-4 text-left text-sm font-semibold hover:no-underline md:px-5 md:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent variant="overlay">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
