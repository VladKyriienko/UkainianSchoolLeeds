/** Build a Supabase public storage URL without initializing the storage client. */
export function getPublicStorageUrl(bucket: string, path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '') ?? '';
  const objectPath = path.replace(/^\//, '');
  return `${base}/storage/v1/object/public/${bucket}/${objectPath}`;
}
