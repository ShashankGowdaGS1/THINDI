import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateOrderPricing } from '@/lib/checkout/pricingEngine';

const calculateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(20),
    })
  ).min(1, 'Cart must have at least one item'),
  pincode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits').optional(),
  promoCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = calculateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid calculation payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { items, pincode = '573201', promoCode } = parsed.data;
    const result = calculateOrderPricing(items, pincode, promoCode);

    return NextResponse.json({
      success: true,
      pricing: result.pricing,
      itemCount: result.itemCount,
      hasFragile: result.hasFragile,
      hasPickle: result.hasPickle,
      totalWeightGrams: result.totalWeightGrams,
      items: result.snapshots,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Pricing calculation failed' },
      { status: 400 }
    );
  }
}

