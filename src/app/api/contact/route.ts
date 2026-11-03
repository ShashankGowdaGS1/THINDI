import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupportTicket } from '@/lib/tracking/trackingStore';
import { checkRateLimit } from '@/lib/tracking/security';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(120),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(1500),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please wait ${rateCheck.retryAfterSeconds} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Please correct the highlighted fields.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    const ticket = createSupportTicket({
      customerName: name,
      customerEmail: email,
      customerPhone: phone || undefined,
      category: 'general_order_enquiry',
      subject,
      message,
      preferredContact: phone ? 'phone' : 'email',
    });

    return NextResponse.json({
      success: true,
      ticketReference: ticket.ticketReference,
      message: 'Thank you! Your message has been received by our Hassan care team.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unable to process contact submission' },
      { status: 500 }
    );
  }
}

