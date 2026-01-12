import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  bigint,
  timestamp,
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
    title: text('title'),
    photo: text('photo'),
    phone: text('phone'),
    email: text('email'),
    description: text('description'),
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
    description: text('description'),
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
    description: text('description'),
    // You requested field name "data" (likely "date"); using `date` for clarity.
    date: timestamp('date', { withTimezone: true }).defaultNow().notNull(),
    startTime: timestamp('start_time', { withTimezone: true }),
    endTime: timestamp('end_time', { withTimezone: true }),
    location: text('location'),
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

export const documents = pgTable(
  'documents',
  {
    id: uuid('id')
      .primaryKey()
      .notNull()
      .default(sql`gen_random_uuid()`),
    title: text('title').notNull(),
    content: text('content').notNull(),
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
    description: text('description'),
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
  (t) => {
    // Admin check: users with roles.role = 'admin'
    const isAdmin = sql`exists (
      select 1
      from roles
      where roles.user_id = auth.uid()
        and roles.role = 'admin'
    )`;

    return [
      // Anyone can create messages (anon + authenticated)
      pgPolicy('messages_public_insert_anon', {
        for: 'insert',
        to: anonRole,
        withCheck: sql`true`
      }),
      pgPolicy('messages_public_insert_authenticated', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: sql`true`
      }),

      // Admins can read/update/delete all messages
      pgPolicy('messages_admin_select', {
        for: 'select',
        to: authenticatedRole,
        using: isAdmin
      }),
      pgPolicy('messages_admin_update', {
        for: 'update',
        to: authenticatedRole,
        using: isAdmin,
        withCheck: isAdmin
      }),
      pgPolicy('messages_admin_delete', {
        for: 'delete',
        to: authenticatedRole,
        using: isAdmin
      })
    ];
  }
);