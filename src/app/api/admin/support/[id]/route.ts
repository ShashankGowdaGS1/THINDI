import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardAdminApi } from '@/lib/admin/apiGuard';
import {
  getSupportTicketByReference,
  updateSupportTicketStatus,
} from '@/lib/tracking/trackingStore';
import { recordAuditLog } from '@/lib/admin/adminStore';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const updateTicketSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  note: z.string().max(500).optional(),
});

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const guard = guardAdminApi(req, 'support:write');
  if (!guard.authorized || !guard.session) return guard.response!;

  const { id } = await params;
  const ticket = getSupportTicketByReference(id);
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = updateTicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid parameters', details: parsed.error.format() }, { status: 400 });
    }

    const { status, note } = parsed.data;
    const updated = updateSupportTicketStatus(ticket.ticketReference, status, note);

    recordAuditLog({
      action: 'SUPPORT_TICKET_UPDATED',
      actorEmail: guard.session.email,
      actorRole: guard.session.role,
      targetResource: 'support',
      targetId: ticket.ticketReference,
      details: `Updated ticket ${ticket.ticketReference} status to "${status}"${note ? ` with staff note.` : '.'}`,
    });

    return NextResponse.json({ success: true, ticket: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed.' }, { status: 500 });
  }
}

