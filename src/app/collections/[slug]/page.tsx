import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CollectionPageView } from '@/components/collection/CollectionPageView';
import { CRAVING_CATEGORIES, getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';
import { getAllShopProducts } from '@/data/products';
import { getSiteUrl } from '@/data/siteConfig';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const siteUrl = getSiteUrl();

  if (!category) {
    return {
      title: 'Collection Not Found | THINDI',
      description: 'The requested traditional Karnataka food collection could not be found.',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${category.title} (${category.kannadaTitle}) | THINDI Karnataka`,
    description: `Shop authentic ${category.title.toLowerCase()} from Hassan, Karnataka. ${category.description} Handcrafted traditional snacks prepared with time-honoured Karnataka recipes.`,
    alternates: {
      canonical: `/collections/${category.id}`,
    },
    openGraph: {
      title: `${category.title} | THINDI Traditional Food`,
      description: category.description,
      url: `${siteUrl}/collections/${category.id}`,
      type: 'website',
      images: [
        {
          url: `${siteUrl}${category.imageSrc}`,
          width: 1200,
          height: 800,
          alt: `${category.title} collection from Hassan, Karnataka`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} | THINDI Traditional Food`,
      description: category.description,
      images: [`${siteUrl}${category.imageSrc}`],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const allProducts = getAllShopProducts();
  const categoryProducts = allProducts.filter(
    (p) => p.category === category.id && (p.active ?? true)
  );

  const siteUrl = getSiteUrl();

  const collectionJsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Collections',
        item: `${siteUrl}/collections/kuruk-thindi`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.title,
        item: `${siteUrl}/collections/${category.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <CollectionPageView
          category={category}
          allCategories={CRAVING_CATEGORIES}
          products={categoryProducts}
        />
      </main>
      <Footer />
    </div>
  );
}

