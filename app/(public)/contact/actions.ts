'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import type { CreateMessageInput } from '@/types';

function isValidEmail(email: string) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// createMessageAction is a server action that creates a new message in the database
export async function createMessageAction(input: CreateMessageInput) {
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = (input.phone ?? '').trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name || !email || !subject || !message) {
    throw new Error('Please fill in all required fields.');
  }

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.');
  }

  const supabase = createAdminClient();

  // `messages` might not exist yet in `lib/supabase/types.ts`.
  // Avoid `any` while still allowing inserts.
  type UntypedInsertResponse = { error: { message: string } | null };
  type UntypedSupabase = {
    from: (table: string) => {
      insert: (
        values: Record<string, unknown>
      ) => Promise<UntypedInsertResponse>;
    };
  };

  const { error } = await (supabase as unknown as UntypedSupabase)
    .from('messages')
    .insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      read: false
    });

  if (error) {
    throw new Error(error.message);
  }
}
