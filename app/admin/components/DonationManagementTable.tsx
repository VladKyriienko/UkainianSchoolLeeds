'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { PoundSterling } from 'lucide-react';
import type { AdminDonation } from '@/app/admin/donations/actions';
import { format } from 'date-fns';

type DonationManagementTableProps = {
  donations: AdminDonation[];
};

function formatAmount(cents: number, currency: string): string {
  const amount = (cents / 100).toFixed(2);
  if (currency.toLowerCase() === 'gbp') {
    return `£${amount}`;
  }
  return `${amount} ${currency.toUpperCase()}`;
}

export default function DonationManagementTable({
  donations
}: DonationManagementTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch {
      return '—';
    }
  };

  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <PoundSterling className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No donations yet
        </h3>
        <p className="text-muted-foreground">
          Donations will appear here once received.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Date</TableHead>
              <TableHead className="w-[120px]">Amount</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[220px]">Donor Email</TableHead>
              <TableHead>Session ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell className="text-muted-foreground">
                  {formatDate(donation.created_at)}
                </TableCell>
                <TableCell className="font-medium">
                  {formatAmount(donation.amount_cents, donation.currency)}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      donation.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : donation.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {donation.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {donation.donor_email || '—'}
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs truncate max-w-[200px]">
                  {donation.stripe_session_id}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
