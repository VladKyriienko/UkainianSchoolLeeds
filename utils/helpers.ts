function normalizeSiteOrigin(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  return trimmed.includes('http') ? trimmed : `https://${trimmed}`;
}

function isLocalhostOrigin(value: string): boolean {
  try {
    const u = new URL(value.includes('http') ? value : `https://${value}`);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  } catch {
    return /localhost|127\.0\.0\.1/i.test(value);
  }
}

/**
 * Canonical browser origin for auth redirects, emails (e.g. Supabase invite `redirectTo`), and metadata.
 *
 * **Production:** set `NEXT_PUBLIC_SITE_URL` to your real domain (e.g. `https://school.example.com`).
 * If it is missing or still points at `localhost`, invite and magic-link emails will contain wrong links.
 *
 * On Vercel we also fall back to `VERCEL_URL` / `NEXT_PUBLIC_VERCEL_URL` so deploys work without a custom env,
 * but for a **custom domain** you should still set `NEXT_PUBLIC_SITE_URL` explicitly.
 */
export const getURL = (path: string = '') => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? '';
  const publicVercel = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ?? '';
  const runtimeVercel = process.env.VERCEL_URL?.trim() ?? '';

  let url: string;
  const siteUrlLooksInvalidForProd =
    process.env.NODE_ENV === 'production' &&
    siteUrl !== '' &&
    isLocalhostOrigin(siteUrl);

  if (siteUrlLooksInvalidForProd) {
    console.warn(
      '[getURL] NEXT_PUBLIC_SITE_URL is localhost in production; it will be ignored. Set NEXT_PUBLIC_SITE_URL to your public HTTPS origin (e.g. https://example.com).'
    );
  }

  if (siteUrl !== '' && !siteUrlLooksInvalidForProd) {
    url = normalizeSiteOrigin(siteUrl);
  } else if (publicVercel !== '') {
    url = normalizeSiteOrigin(publicVercel);
  } else if (runtimeVercel !== '') {
    url = normalizeSiteOrigin(runtimeVercel.replace(/^https?:\/\//, ''));
  } else {
    url = 'http://localhost:3000';
  }

  url = url.replace(/\/+$/, '');
  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ['status', 'status_description'],
  error: ['error', 'error_description']
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType] || [
    'status',
    'status_description'
  ];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );
