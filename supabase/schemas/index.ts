import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  bigint,
  timestamp,
  time,
  jsonb,
  pgPolicy
} from 'drizzle-orm/pg-core';
import { crudPolicy } from 'drizzle-orm/neon';
import { authenticatedRole, anonRole } from 'drizzle-orm/supabase';
import { sql } from 'drizzle-orm';

// Users table (define first to avoid reference errors)
export const users = pgTable(
  'users',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    birthdate: timestamp('birthdate', { withTimezone: true }),
    marketingConsent: boolean('marketing_consent').default(false),
    isActive: boolean('is_active').notNull().default(true)
  },
  (t) => [
    crudPolicy({
      read: sql`id = auth.uid()`,
      modify: false,
      role: authenticatedRole
    })
  ]
);

// =================================================================================
// ENUMS
// =================================================================================

export const rolesEnum = pgEnum('rolesEnum', ['admin', 'user']);

export const teacherCategoryEnum = pgEnum('teacherCategoryEnum', [
  'HEADTEACHER',
  'TEACHER',
  'STAF'
]);

export const typeDocumentEnum = pgEnum('typeDocumentEnum', [
  'COOKIES_POLICY',
  'PRIVACY_POLICY',
  'DOCUMEND'
]);




export const roles = pgTable(
  'roles',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: rolesEnum('role').notNull().default('user')
  },
  (t) => [
    crudPolicy({
      read: sql`user_id = auth.uid()`,
      modify: false,
      role: authenticatedRole
    })
  ]
);

// Optional organisational login
export const organisations = pgTable(
  'organisations',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    nameUk: text('name_uk'),
    slug: text('slug').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (t) => [
    crudPolicy({
      // auth.uid() in the organisation_memberships table
      read: sql`(
      select organisation_memberships.user_id = auth.uid()
      from organisation_memberships
      where organisation_memberships.organisation_id = id
    )`,
      modify: false,
      role: authenticatedRole
    })
  ]
);

// Organisation memberships table
export const organisationMemberships = pgTable(
  'organisation_memberships',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    organisationId: uuid('organisation_id')
      .notNull()
      .references(() => organisations.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role').notNull()
  },
  (t) => [
    crudPolicy({
      // can only see members from the same organisation
      read: true,
      modify: false,
      role: authenticatedRole
    })
  ]
);

// uploads table
export const userUploads = pgTable(
  'user_uploads',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    fileUrl: text('file_url').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (t) => [
    crudPolicy({
      read: sql`user_id = auth.uid()`,
      modify: false,
      role: authenticatedRole
    })
  ]
);

// =================================================================================
// CONTENT TABLES
// =================================================================================

export const teachers = pgTable(
  'teachers',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    nameUk: text('name_uk'),
    title: text('title'),
    titleUk: text('title_uk'),
    photo: text('photo'),
    phone: text('phone'),
    email: text('email'),
    description: text('description'),
    descriptionUk: text('description_uk'),
    category: teacherCategoryEnum('category').notNull().default('TEACHER'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('teachers_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('teachers_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('teachers_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('teachers_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

export const news = pgTable(
  'news',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    titleUk: text('title_uk'),
    description: text('description'),
    descriptionUk: text('description_uk'),
    // You requested field name "data" (likely "date"); using `date` for clarity.
    date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
    order: integer('order').notNull().default(0),
    photo: text('photo'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('news_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('news_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('news_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('news_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

export const events = pgTable(
  'events',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    titleUk: text('title_uk'),
    description: text('description'),
    descriptionUk: text('description_uk'),
    // You requested field name "data" (likely "date"); using `date` for clarity.
    date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
    startTime: time('start_time'),
    endTime: time('end_time'),
    location: text('location'),
    locationUk: text('location_uk'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('events_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('events_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('events_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('events_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

export const schedule = pgTable(
  'schedule',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
    file: text('file').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('schedule_admin_select', {
        for: 'select',
        to: authenticatedRole,
        using: isAdmin
      }),
      pgPolicy('schedule_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('schedule_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('schedule_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

export const documents = pgTable(
  'documents',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    titleUk: text('title_uk'),
    content: text('content').notNull(),
    contentUk: text('content_uk'),
    type: typeDocumentEnum('type').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('documents_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('documents_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('documents_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('documents_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

export const classes = pgTable(
  'classes',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    titleUk: text('title_uk'),
    description: text('description'),
    descriptionUk: text('description_uk'),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('classes_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('classes_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('classes_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('classes_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

// Note: table name requested as `class_photo_galery` (typo preserved).
export const classPhotoGalery = pgTable(
  'class_photo_galery',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    classId: uuid('class_id')
      .notNull()
      .references(() => classes.id),
    photo: text('photo').notNull(),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('class_photo_galery_public_select', {
        for: 'select',
        to: [anonRole, authenticatedRole],
        using: sql`true`
      }),
      pgPolicy('class_photo_galery_admin_insert', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: isAdmin
      }),
      pgPolicy('class_photo_galery_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('class_photo_galery_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

// Donations table (Stripe one-time payments)
export const donations = pgTable(
  'donations',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    stripeSessionId: text('stripe_session_id').notNull().unique(),
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('gbp'),
    status: text('status').notNull().default('pending'),
    donorEmail: text('donor_email'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      pgPolicy('donations_admin_select', {
        for: 'select',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);

// Messages table (contact form submissions)
export const messages = pgTable(
  'messages',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    read: boolean('read').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  () => {
    // No RLS policies: table is accessible only via service_role (server-side with createAdminClient).
    // Anon and authenticated have no access.
    return [];
  }
);