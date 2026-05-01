import { headers } from 'next/headers';
import { getURL } from '@/utils/helpers';

function firstForwardedValue(value: string | null | undefined): string {
  if (!value) return '';
  return value.split(',')[0]?.trim() ?? '';
}

function isLocalhostHost(host: string): boolean {
  const h = host.toLowerCase();
  return (
    h === 'localhost' ||
    h.startsWith('localhost:') ||
    h.startsWith('127.0.0.1') ||
    h.startsWith('127.0.0.1:')
  );
}

/**
 * Absolute URL for Supabase auth emails (`redirectTo`, `emailRedirectTo`).
 * Prefers the **current request** host (admin opened the site on production → correct link),
 * then falls back to {@link getURL} (env-based).
 */
export async function getAuthEmailRedirectUrl(path = ''): Promise<string> {
  try {
    const h = await headers();
    const host = firstForwardedValue(
      h.get('x-forwarded-host') ?? h.get('host')
    );
    if (!host) {
      return getURL(path);
    }

    if (process.env.NODE_ENV === 'production' && isLocalhostHost(host)) {
      return getURL(path);
    }

    let proto = firstForwardedValue(h.get('x-forwarded-proto')).toLowerCase();
    if (proto !== 'http' && proto !== 'https') {
      proto = isLocalhostHost(host) ? 'http' : 'https';
    }

    const origin = `${proto}://${host}`.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return normalizedPath ? `${origin}/${normalizedPath}` : origin;
  } catch {
    return getURL(path);
  }
}
