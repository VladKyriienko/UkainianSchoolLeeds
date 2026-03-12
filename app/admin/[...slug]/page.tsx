import { notFound } from 'next/navigation';

/**
 * Catch-all for unknown /admin/* paths. Renders admin not-found without
 * leaving the segment, avoiding unstable 404 handling that can cause refresh loops.
 */
export default function AdminCatchAll() {
  notFound();
}
