-- create an admin user
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'admin@admin.uk',
        crypt ('mHMGB1uzkdfQ16xU', gen_salt ('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    )
;

-- set admin role
update roles set role = 'admin' where user_id = '00000000-0000-0000-0000-000000000000';


-- create a non-admin user
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000',
        '11111111-1111-1111-1111-111111111111',
        'authenticated',
        'authenticated',
        'user@user.uk',
        crypt ('TestPassword123', gen_salt ('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    )
;

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        identity_data,
        provider_id,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            id,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

-- set user role
update roles set role = 'user' where user_id = '11111111-1111-1111-1111-111111111111';

-- Insert sample events for calendar
INSERT INTO public.events (title, description, date, start_time, end_time, location)
VALUES
    ('U10s Beecroft home match', 'Home football match for Under 10s team', '2026-01-22', '15:30', '16:30', 'School Sports Field'),
    ('RSPB big bird watch', 'Annual bird watching event with RSPB', '2026-01-23', NULL, NULL, 'Meanwood School Green Road, Meanwood, Leeds, West Yorkshire, United Kingdom'),
    ('Y4 PTA cake sale', 'Year 4 cake sale fundraiser', '2026-01-23', '15:15', '15:45', 'School Main Hall'),
    ('KS1 Winter Olympics - Mandela Centre', 'Key Stage 1 winter sports event', '2026-01-28', '13:00', '15:00', 'Mandela Centre'),
    ('Y2 pop up museum', 'Year 2 history project exhibition', '2026-01-29', '14:30', '15:15', 'Year 2 Classroom'),
    ('Parent Teacher Conferences', 'Spring term parent-teacher meetings', '2026-02-05', '16:00', '20:00', 'All Classrooms'),
    ('School Science Fair', 'Annual science project presentations', '2026-02-12', '09:00', '15:00', 'School Hall'),
    ('Half Term Break', 'School closed for half term holiday', '2026-02-16', NULL, NULL, NULL);
