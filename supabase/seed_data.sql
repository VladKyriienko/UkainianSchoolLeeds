-- Demo/content data — runs after supabase/seed.sql (see config.toml [db.seed].sql_paths)
-- Tables: events, classes, teachers, news, documents

-- Events (25) — title_uk, description_uk, location_uk
INSERT INTO public.events (title, title_uk, description, description_uk, date, start_time, end_time, location, location_uk)
VALUES
    ('U10s Beecroft home match', 'Домашній матч U10 Бікрофт', 'Home football match for Under 10s team', 'Домашній футбольний матч для команди до 10 років', '2026-01-22 00:00:00+00'::timestamptz, '15:30'::time, '16:30'::time, 'School Sports Field', 'Шкільне спортивне поле'),
    ('RSPB big bird watch', 'Великий птахолічий RSPB', 'Annual bird watching event with RSPB', 'Щорічне спостереження за птахами разом з RSPB', '2026-01-23 00:00:00+00'::timestamptz, NULL, NULL, 'Meanwood School Green Road, Leeds', 'Мінвуд, зелена доріжка біля школи, Лідс'),
    ('Y4 PTA cake sale', 'Ярмарок випічки PTA, 4 клас', 'Year 4 cake sale fundraiser', 'Благодійний ярмарок випічки 4-го класу', '2026-01-23 00:00:00+00'::timestamptz, '15:15'::time, '15:45'::time, 'School Main Hall', 'Головна зала школи'),
    ('KS1 Winter Olympics', 'Зимові олімпійські ігри KS1', 'Key Stage 1 winter sports event', 'Зимові спортивні змагання для першого ступеня', '2026-01-28 00:00:00+00'::timestamptz, '13:00'::time, '15:00'::time, 'Mandela Centre', 'Центр Мандела'),
    ('Y2 pop up museum', 'Міні-музей 2 класу', 'Year 2 history project exhibition', 'Виставка історичного проєкту 2-го класу', '2026-01-29 00:00:00+00'::timestamptz, '14:30'::time, '15:15'::time, 'Year 2 Classroom', 'Клас 2 року'),
    ('Parent Teacher Conferences', 'Батьківські збори', 'Spring term parent-teacher meetings', 'Зустрічі батьків і вчителів у весняному семестрі', '2026-02-05 00:00:00+00'::timestamptz, '16:00'::time, '20:00'::time, 'All Classrooms', 'Усі класи'),
    ('School Science Fair', 'Шкільний науковий ярмарок', 'Annual science project presentations', 'Щорічні презентації наукових проєктів', '2026-02-12 00:00:00+00'::timestamptz, '09:00'::time, '15:00'::time, 'School Hall', 'Шкільна зала'),
    ('Half Term Break', 'Канікули в середині семестру', 'School closed for half term holiday', 'Школа зачинена на канікули', '2026-02-16 00:00:00+00'::timestamptz, NULL, NULL, NULL, NULL),
    ('World Book Day', 'День книги', 'Dress up as your favourite character and share stories.', 'Переодягніться у улюбленого героя та діліться історіями.', '2026-03-05 00:00:00+00'::timestamptz, '09:00'::time, '15:30'::time, 'School', 'Школа'),
    ('Y3 theatre trip', 'Поїздка 3 класу в театр', 'Year 3 visit to local theatre.', 'Відвідування місцевого театру учнями 3-го класу.', '2026-03-10 00:00:00+00'::timestamptz, '10:00'::time, '14:00'::time, 'City Theatre', 'Міський театр'),
    ('Easter egg hunt', 'Полювання за великодніми яйцями', 'Easter celebration for KS1 and KS2.', 'Великоднє свято для першого та другого ступенів.', '2026-03-28 00:00:00+00'::timestamptz, '11:00'::time, '12:30'::time, 'School grounds', 'Територія школи'),
    ('Easter break', 'Великодні канікули', 'School closed for Easter holiday.', 'Школа зачинена на великодні канікули.', '2026-04-01 00:00:00+00'::timestamptz, NULL, NULL, NULL, NULL),
    ('Y5 residential trip', 'Виїзд 5 класу', 'Year 5 residential outdoor education.', 'Виїзне навчання на природі для 5-го класу.', '2026-04-15 00:00:00+00'::timestamptz, NULL, NULL, 'Outdoor centre', 'Навчальний центр на природі'),
    ('SATs week', 'Тиждень тестів SATs', 'Key Stage 2 statutory assessments.', 'Обов''язкові перевірки для другого ступеня.', '2026-05-11 00:00:00+00'::timestamptz, '09:00'::time, '12:00'::time, 'All KS2 classrooms', 'Усі класи KS2'),
    ('Sports day', 'Спортивний день', 'Annual sports day — races and team events.', 'Щорічний спортивний день — забіги та командні змагання.', '2026-05-22 00:00:00+00'::timestamptz, '09:30'::time, '15:00'::time, 'School Sports Field', 'Шкільне спортивне поле'),
    ('Summer fair', 'Літній ярмарок', 'PTA summer fair — stalls and activities.', 'Літній ярмарок PTA — крамнички та активності.', '2026-06-06 00:00:00+00'::timestamptz, '12:00'::time, '16:00'::time, 'School grounds', 'Територія школи'),
    ('Y6 leavers assembly', 'Випускний збір 6 класу', 'Year 6 leavers celebration and assembly.', 'Святкування випуску 6-го класу та збір.', '2026-07-17 00:00:00+00'::timestamptz, '10:00'::time, '11:30'::time, 'School Hall', 'Шкільна зала'),
    ('End of term', 'Кінець семестру', 'School closes for summer break.', 'Школа закривається на літні канікули.', '2026-07-22 00:00:00+00'::timestamptz, NULL, NULL, NULL, NULL),
    ('INSET day', 'День педагогічної ради', 'Staff training — school closed to pupils.', 'Навчання персоналу — школа зачинена для учнів.', '2026-09-01 00:00:00+00'::timestamptz, NULL, NULL, 'School', 'Школа'),
    ('Autumn term starts', 'Початок осіннього семестру', 'First day of autumn term.', 'Перший день осіннього семестру.', '2026-09-02 00:00:00+00'::timestamptz, '08:45'::time, '15:15'::time, 'School', 'Школа'),
    ('Harvest festival', 'Свято урожаю', 'Harvest assembly and food collection for charity.', 'Збір на свято урожаю та збір їжі для благодійності.', '2026-10-09 00:00:00+00'::timestamptz, '09:30'::time, '10:15'::time, 'School Hall', 'Шкільна зала'),
    ('Halloween disco', 'Гелловін-дискотека', 'PTA Halloween disco for pupils.', 'Гелловін-дискотека PTA для учнів.', '2026-10-30 00:00:00+00'::timestamptz, '16:00'::time, '18:00'::time, 'School Hall', 'Шкільна зала'),
    ('Remembrance assembly', 'Збір пам''яті', 'Remembrance Day assembly.', 'Збір на День пам''яті.', '2026-11-11 00:00:00+00'::timestamptz, '10:45'::time, '11:15'::time, 'School Hall', 'Шкільна зала'),
    ('Christmas fair', 'Різдвяний ярмарок', 'PTA Christmas fair and Santa''s grotto.', 'Різдвяний ярмарок PTA та кабінет Санти.', '2026-12-05 00:00:00+00'::timestamptz, '15:00'::time, '18:00'::time, 'School', 'Школа'),
    ('Nativity play', 'Різдвяна вистава', 'Reception and KS1 nativity performance.', 'Різдвяна вистава прийомної групи та KS1.', '2026-12-15 00:00:00+00'::timestamptz, '14:00'::time, '15:00'::time, 'School Hall', 'Шкільна зала'),
    ('Christmas break', 'Різдвяні канікули', 'School closed for Christmas holiday.', 'Школа зачинена на різдвяні канікули.', '2026-12-19 00:00:00+00'::timestamptz, NULL, NULL, NULL, NULL);

-- Classes (6)
INSERT INTO public.classes (title, title_uk, description, "order")
VALUES
    ('Reception', 'Прийомна група', 'Foundation stage overview', 0),
    ('Year 1', '1 рік', 'Year 1 class page', 1),
    ('Year 2', '2 рік', 'Year 2 class page', 2),
    ('Year 3', '3 рік', 'Year 3 class page', 3),
    ('Year 4', '4 рік', 'Year 4 class page', 4),
    ('Year 5', '5 рік', 'Year 5 class page', 5);

-- Teachers (5)
INSERT INTO public.teachers (name, name_uk, title, title_uk, category, email, description)
VALUES
    ('Jane Smith', 'Джейн Сміт', 'Headteacher', 'Директор', 'HEADTEACHER', 'j.smith@school.uk', 'School leadership and vision.'),
    ('John Doe', 'Джон Доу', 'Deputy Head', 'Заступник директора', 'TEACHER', 'j.doe@school.uk', 'Curriculum and pastoral support.'),
    ('Mary Williams', 'Мері Вільямс', 'Class Teacher', 'Класний керівник', 'TEACHER', 'm.williams@school.uk', 'Year 4 class teacher.'),
    ('David Brown', 'Девід Браун', 'SENCO', 'SENCO', 'STAF', 'd.brown@school.uk', 'Special educational needs coordinator.'),
    ('Sarah Jones', 'Сара Джонс', 'Office Manager', 'Адміністратор', 'STAF', 's.jones@school.uk', 'Front office and enquiries.');

-- News (10)
INSERT INTO public.news (title, title_uk, description, description_uk, date, "order")
VALUES
    ('Welcome back', 'Ласкаво просимо', 'We hope everyone had a great break.', 'Сподіваємось, усі гарно відпочили.', now(), 0),
    ('PTA meeting', 'Зустріч PTA', 'Next PTA meeting — all welcome.', 'Наступна зустріч PTA — усі бажаючі.', now(), 1),
    ('Sports day', 'Спортивний день', 'Sports day this summer — save the date.', 'Спортивний день цього літа.', now(), 2),
    ('Uniform reminder', 'Нагадування про форму', 'Please label all uniform items.', 'Підпишіть усе формене.', now(), 3),
    ('Library open', 'Бібліотека відкрита', 'Extended hours for book borrowing.', 'Подовжені години видачі книг.', now(), 4),
    ('Music concert', 'Музичний концерт', 'Summer concert — tickets soon.', 'Літній концерт — квитки незабаром.', now(), 5),
    ('Attendance', 'Відвідуваність', 'Every day counts — thank you.', 'Кожен день на рахунку.', now(), 6),
    ('School trip', 'Шкільна поїздка', 'Year 5 trip — consent forms due.', 'Поїздка 5 року — анкети.', now(), 7),
    ('Safeguarding', 'Захист дітей', 'Our safeguarding policy is on the website.', 'Політика захисту на сайті.', now(), 8),
    ('Head message', 'Звернення директора', 'Weekly update from the headteacher.', 'Щотижневе оновлення від директора.', now(), 9);

-- Documents (3)
INSERT INTO public.documents (title, title_uk, content, content_uk, type)
VALUES
    (
        'Cookies policy',
        'Політика cookies',
        'We use cookies to improve your experience. Essential cookies are required; analytics are optional.',
        'Ми використовуємо cookies для зручності. Обов''язкові cookies необхідні; аналітика — за бажанням.',
        'COOKIES_POLICY'
    ),
    (
        'Privacy policy',
        'Політика конфіденційності',
        'How we collect, store and process personal data in line with UK GDPR.',
        'Як ми збираємо та обробляємо персональні дані відповідно до UK GDPR.',
        'PRIVACY_POLICY'
    ),
    (
        'School handbook',
        'Шкільний довідник',
        'General information for parents: timings, uniform, behaviour expectations.',
        'Загальна інформація для батьків: режим, форма, правила поведінки.',
        'DOCUMEND'
    );
