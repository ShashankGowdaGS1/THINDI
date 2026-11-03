import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { CollectionPageView } from '@/components/collection/CollectionPageView';
import { CRAVING_CATEGORIES, getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';
import { getAllShopProducts } from '@/data/products';

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

  if (!category) {
    return {
      title: 'Collection Not Found | THINDI',
      description: 'The requested traditional Karnataka food collection could not be found.',
    };
  }

  return {
    title: `${category.title} (${category.kannadaTitle}) | THINDI Karnataka`,
    description: `Shop authentic ${category.title.toLowerCase()} from Hassan, Karnataka. ${category.description} Handcrafted traditional snacks made with cold-pressed oils.`,
    openGraph: {
      title: `${category.title} | THINDI Traditional Food`,
      description: category.description,
      images: [category.imageSrc],
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

  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
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

