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
import { formatDateTimeLabel } from '@/utils/date-format';
import { EntityEmptyState } from '@/components/common/admin/EntityEmptyState';
import { EntityTableShell } from '@/components/common/admin/EntityTableShell';
import { StatusBadge } from '@/components/common/admin/StatusBadge';

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
  if (donations.length === 0) {
    return (
      <EntityEmptyState
        icon={PoundSterling}
        title="No donations yet"
        description="Donations will appear here once received."
      />
    );
  }

  return (
    <EntityTableShell>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Date</TableHead>
            <TableHead className="w-30">Amount</TableHead>
            <TableHead className="w-25">Status</TableHead>
            <TableHead className="w-55">Donor Email</TableHead>
            <TableHead>Session ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell className="text-muted-foreground">
                {formatDateTimeLabel(donation.created_at)}
              </TableCell>
              <TableCell className="font-medium">
                {formatAmount(donation.amount_cents, donation.currency)}
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={donation.status}
                  variant={
                    donation.status === 'completed'
                      ? 'success'
                      : donation.status === 'pending'
                        ? 'warning'
                        : 'muted'
                  }
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {donation.donor_email || '—'}
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs truncate max-w-50">
                {donation.stripe_session_id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </EntityTableShell>
  );
}
