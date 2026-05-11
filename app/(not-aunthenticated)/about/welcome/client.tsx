'use client';

import { useLanguage } from '@/providers/language-provider';
import { BookOpen, CreditCard, Phone } from 'lucide-react';

const WELCOME_CONTENT = {
  en: {
    sections: [
      {
        title: 'General information about the school',
        icon: BookOpen,
        paragraphs: [
          'Lessons take place every Saturday from 14:00 to 17:30.',
          'The school has three age groups for children aged 5 to 14.',
          'Subjects include Ukrainian and English languages, history, cultural studies, geography, music, drama, and visual arts.',
          'The last Saturday of each month is used to celebrate children’s birthdays with greetings and cake.',
          'The lesson schedule is published in the parents group chat on Friday evening before the school Saturday.',
          'After each Saturday, photos of the learning process and children are published on the Facebook page. Follow us!'
        ]
      },
      {
        title: 'Tuition',
        icon: CreditCard,
        paragraphs: [
          'The tuition fee is set by the parents committee at the beginning of each school year. Payment can be made monthly or by semester, depending on your preference. Discounts are available for children from the same family and for members of the AUGB family.',
          'Funds are used to reimburse teachers for their expenses and to purchase stationery and other consumable materials.',
          'Each semester, parents can review the list of expenses at parent meetings.',
          'The tuition fee for the 2024-2025 school year is £25 per month or £75 per semester.'
        ]
      },
      {
        title: 'Contact information for questions, suggestions, or complaints',
        icon: Phone,
        paragraphs: [
          'Director: Mr Oleksandr Povstian',
          'WhatsApp, Viber, Telegram: 07926248347',
          'Parents Committee: Yuliia Sakhno, +380505436720 WhatsApp'
        ]
      }
    ]
  },
  uk: {
    sections: [
      {
        title: 'Загальна інформація про школу',
        icon: BookOpen,
        paragraphs: [
          'Навчання проходить кожної суботи з 14:00 до 17:30.',
          'Школа має три вікові групи для дітей від 5 до 14 років.',
          'Викладаються такі предмети як українська та англійська мови, історія, культурологія, географія, музика, акторська майстерність, образотворче мистецтво.',
          'Остання субота місяця - святкування днів народжень зі святковим привітанням та тортом.',
          'Розклад навчання публікується в груповому чаті батьків у пʼятницю ввечері перед навчальною суботою.',
          'Після кожної суботи на сторінці в фейсбуці публікуються фото навчального процесу та дітей. Підписуйтесь!'
        ]
      },
      {
        title: 'Оплата навчання',
        icon: CreditCard,
        paragraphs: [
          'Вартість навчання встановлює батьківський комітет на початку кожного навчального року. Оплата має здійснюватись за вашим бажанням - або кожного місяця, або за семестр. Для дітей з однієї сімʼї та членів родини СУБ є знижки.',
          'Гроші йдуть на відшкодування викладачам їхніх витрат, а також для закупівлі канцелярії та інших витратних матеріалів.',
          'Кожного семестру на батьківських зборах можна ознайомитись з переліком витрат.',
          'Вартість навчання за місяць на 2024-2025 навчальний рік становить 25 фунтів або 75 фунтів за семестр.'
        ]
      },
      {
        title: 'Контактна інформація для будь-яких питань, побажань чи скарг',
        icon: Phone,
        paragraphs: [
          'Директор: пан Олександр Повстян',
          'WhatsApp, Viber, Telegram: 07926248347',
          'Керівництво Батьківського Комітету: Сахно Юлія, +380505436720 WhatsApp'
        ]
      }
    ]
  }
} as const;

export default function WelcomeContent() {
  const { language } = useLanguage();
  const content = WELCOME_CONTENT[language];

  return (
    <div className="w-full space-y-12">
      {content.sections.map((section) => {
        const Icon = section.icon;

        return (
          <section
            key={section.title}
            className="border-b border-border pb-10 last:border-b-0 last:pb-0"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground">
                {section.title}
              </h2>
            </div>
            <div className="space-y-4 text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
