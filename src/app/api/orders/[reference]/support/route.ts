import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { findOrderByReference } from '@/lib/checkout/orderStore';
import { verifyOrderSessionToken } from '@/lib/tracking/security';
import { createSupportTicket } from '@/lib/tracking/trackingStore';

const supportSchema = z.object({
  category: z.enum([
    'delivery_issue',
    'damaged_product',
    'missing_item',
    'incorrect_item',
    'payment_issue',
    'general_order_enquiry',
  ]),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().trim().min(10, 'Please provide more details (at least 10 characters)').max(1000),
  preferredContact: z.enum(['email', 'phone']).optional(),
});

interface RouteContext {
  params: Promise<{ reference: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const { reference } = await params;
    const normalizedRef = reference.trim().toUpperCase();

    const order = findOrderByReference(normalizedRef);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify session
    const sessionCookie = req.cookies.get('thindi_order_session')?.value;
    const isSessionValid = verifyOrderSessionToken(sessionCookie, normalizedRef);

    const tokenParam = req.nextUrl.searchParams.get('token');
    const isTokenValid = Boolean(tokenParam && order.accessToken === tokenParam.trim());

    if (!isSessionValid && !isTokenValid) {
      return NextResponse.json(
        { error: 'Unauthorized. Please verify order access before submitting support enquiries.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = supportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid enquiry parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { category, subject, message, preferredContact = 'email' } = parsed.data;

    const ticket = createSupportTicket({
      orderReference: normalizedRef,
      customerEmail: order.customer.email,
      customerPhone: order.customer.phone,
      customerName: order.customer.fullName,
      category,
      subject,
      message,
      preferredContact,
    });

    return NextResponse.json({
      success: true,
      ticketReference: ticket.ticketReference,
      message:
        'Your support enquiry has been registered with the THINDI Hassan Kitchen team.',
      ticket: {
        reference: ticket.ticketReference,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to submit support enquiry' },
      { status: 500 }
    );
  }
}

