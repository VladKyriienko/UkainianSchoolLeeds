import type { DocumentType } from '@/types';

export const DOCUMENT_TYPES = ['COOKIES_POLICY', 'PRIVACY_POLICY', 'DOCUMEND'] as const;

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  COOKIES_POLICY: 'Cookies Policy',
  PRIVACY_POLICY: 'Privacy Policy',
  DOCUMEND: 'Document'
};
