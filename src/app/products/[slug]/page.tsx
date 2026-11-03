import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { getProductBySlug, getAllProductSlugs } from '@/data/products';
import { getSiteUrl } from '@/data/siteConfig';
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
  const siteUrl = getSiteUrl();

  if (!product) {
    return {
      title: 'Product Not Found | THINDI',
      description: 'The requested traditional Karnataka food item could not be found.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${product.name} (${product.kannadaName}) | THINDI Foods Hassan`,
    description: product.shortDescription,
    keywords: product.keywords,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | THINDI Traditional Foods`,
      description: product.shortDescription,
      url: `${siteUrl}/products/${product.slug}`,
      type: 'website',
      images: [
        {
          url: `${siteUrl}${product.imageSrc}`,
          width: 1200,
          height: 896,
          alt: product.imageAlt || product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | THINDI Foods Hassan`,
      description: product.shortDescription,
      images: [`${siteUrl}${product.imageSrc}`],
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

  const siteUrl = getSiteUrl();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${siteUrl}/products/${product.slug}#product`,
        name: product.name,
        description: product.shortDescription,
        image: `${siteUrl}${product.imageSrc}`,
        brand: {
          '@type': 'Brand',
          name: 'THINDI',
        },
        category: product.category,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteUrl,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Shop',
            item: `${siteUrl}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.name,
            item: `${siteUrl}/products/${product.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream text-jaggery selection:bg-chilli selection:text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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

