import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createDocumentSlug } from '@/utils/document-slug';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('documents')
      .select('id, title, title_uk, created_at')
      .eq('type', 'DOCUMEND')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching key info nav documents:', error);
      return NextResponse.json({ documents: [] }, { status: 200 });
    }

    return NextResponse.json({
      documents: (data ?? []).map((document) => ({
        ...document,
        slug: createDocumentSlug({
          id: document.id,
          title: document.title
        })
      }))
    });
  } catch (err) {
    console.error('Unexpected key info nav documents error:', err);
    return NextResponse.json({ documents: [] }, { status: 200 });
  }
}
