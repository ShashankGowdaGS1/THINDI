import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { getProductBySlug, getAllProductSlugs } from '@/data/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel';
import { ProductStory } from '@/components/product/ProductStory';
import { RelatedProducts } from '@/components/product/RelatedProducts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | THINDI',
      description: 'The requested traditional Karnataka food item could not be found.',
    };
  }

  return {
    title: `${product.name} (${product.kannadaName}) | THINDI Foods Hassan`,
    description: product.shortDescription,
    keywords: product.keywords,
    openGraph: {
      title: `${product.name} | THINDI Traditional Foods`,
      description: product.shortDescription,
      images: [
        {
          url: product.imageSrc,
          alt: product.imageAlt || product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.imageSrc];

  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      {/* Brand Navigation */}
      <Header />

      {/* Main Product Shopping Flow */}
      <main className="flex-1">
        {/* Main Product Showcase: Gallery (Left 55%) + Purchase Panel (Right 45%) */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
              {/* Left 55% Column: Photography Gallery */}
              <div className="lg:col-span-7">
                <ProductGallery images={images} productName={product.name} />
              </div>

              {/* Right 45% Column: Purchase & Disclosure Panel */}
              <div className="lg:col-span-5">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </div>
        </section>

        {/* Product Editorial Culinary Heritage Story */}
        <ProductStory product={product} />

        {/* Complementary Snack Recommendations */}
        <RelatedProducts currentProduct={product} />
      </main>

      {/* Global Brand Footer */}
      <Footer />
    </div>
  );
}

