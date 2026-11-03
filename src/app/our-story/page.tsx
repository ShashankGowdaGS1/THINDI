import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ArrowRight, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/brand/Button';

export const metadata: Metadata = {
  title: 'Our Story | Good Thindi, Great Memories | THINDI Hassan',
  description:
    'Discover the culinary roots of THINDI originating in Hassan, Karnataka. Authentic handmade chakkali, kodubale, nippattu, and traditional flavours crafted to be shared.',
  openGraph: {
    title: 'Our Story | THINDI — Hassan, Karnataka',
    description:
      'Some flavours stay with us. Explore the authentic culinary heritage of Karnataka traditional savouries from Hassan.',
    images: ['/images/story/story-heritage.jpg'],
  },
};

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />

      <main className="flex-1">
        {/* ========================================================
            1. CINEMATIC EDITORIAL INTRO
            ======================================================== */}
        <section className="relative pt-12 pb-16 md:pt-18 md:pb-20 overflow-hidden border-b border-jaggery/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chilli/10 border border-chilli/20 text-xs font-semibold uppercase tracking-widest text-chilli mb-5">
                <MapPin className="w-3.5 h-3.5" />
                <span>OUR ROOTS · HASSAN, KARNATAKA</span>
                <span className="text-chilli/40 font-normal">|</span>
                <span className="font-kannada font-normal normal-case">ಹಾಸನದ ಮಣ್ಣಿನ ರುಚಿ</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-jaggery tracking-tight leading-[1.08]">
                Good thindi.
                <span className="block text-chilli">Great memories.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-5 font-sans text-base sm:text-lg text-jaggery-muted leading-relaxed max-w-2xl text-pretty">
                Some flavours stay with us. The familiar crunch of chakkali, the warmth of kodubale,
                and the little treats that bring people together around a steel tumbler of hot filter coffee.
              </p>
            </div>

            {/* Editorial Hero Photograph */}
            <div className="relative rounded-2xl overflow-hidden border border-jaggery/15 shadow-sm aspect-[16/9] md:aspect-[21/9] bg-cream-dark">
              <Image
                src="/images/story/story-heritage.jpg"
                alt="Traditional brass plates with authentic Karnataka handmade savouries and filter coffee"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-jaggery/80 via-jaggery/20 to-transparent flex items-end p-6 sm:p-10">
                <p className="font-display text-cream text-lg sm:text-2xl font-medium italic max-w-xl">
                  &ldquo;Every snack holds the memory of an afternoon spent waiting by the kitchen stove for the first crisp batch.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            2. FOODS OF KARNATAKA: VARIED EDITORIAL SPREAD
            ======================================================== */}
        <section className="py-16 md:py-24 bg-[#FAF5EC] border-b border-jaggery/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-turmeric-dark font-sans">
                TRADITIONAL PANTRY CLASSICS · ತಿಂಡಿ ವೈವಿಧ್ಯ
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery mt-2">
                The Foods We Grew Up With
              </h2>
              <p className="text-sm font-sans text-jaggery-muted mt-2 leading-relaxed">
                Karnataka snacking is an art of patience. From the concentric spirals of star-aperture chakkali
                to the gentle sweetness of jaggery obbattu, each recipe carries regional identity and honest craft.
              </p>
            </div>

            {/* Varied Editorial Composition 1: Chakkali & Savouries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
              <div className="lg:col-span-7 relative">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-jaggery/15 shadow-sm bg-cream-dark">
                  <Image
                    src="/images/products/chakkali.jpg"
                    alt="Golden spiral chakkali arranged on traditional brass platter"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-sans font-semibold text-jaggery border border-jaggery/10">
                    Hand-Pressed Chakkali · ಹಾಸನ ಚಕ್ಕುಲಿ
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <span className="font-mono text-xs font-bold text-chilli uppercase tracking-wider">
                  01 · The Savoury Crunch
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-jaggery">
                  Chakkali & Kodubale
                </h3>
                <p className="font-sans text-sm text-jaggery-muted leading-relaxed">
                  Pressed through heirloom brass moulds and rolled into golden rings with fresh coconut and ajwain.
                  A crisp, hollow snap that breaks cleanly with fragrant cumin and cracked black pepper.
                </p>
                <div className="pt-1">
                  <Link
                    href="/collections/kuruk-thindi"
                    className="text-xs font-semibold text-chilli hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Browse Kuruk Thindi Savouries</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Varied Editorial Composition 2: Obbattu & Festive Sweets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
                <span className="font-mono text-xs font-bold text-chilli uppercase tracking-wider">
                  02 · Festive Warmth
                </span>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-jaggery">
                  Obbattu & Kajjaya
                </h3>
                <p className="font-sans text-sm text-jaggery-muted leading-relaxed">
                  Soft, paper-thin crêpes filled with cardamom-spiced jaggery and chana dal puran, lightly brushed with ghee.
                  The revered sweet centerpiece of Ugadi celebrations and family gatherings across Karnataka.
                </p>
                <div className="pt-1">
                  <Link
                    href="/collections/sihi-thindi"
                    className="text-xs font-semibold text-chilli hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>Browse Festive Sweets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 relative">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-jaggery/15 shadow-sm bg-cream-dark">
                  <Image
                    src="/images/products/obbattu.jpg"
                    alt="Golden Bele Obbattu served on fresh green banana leaf with pure ghee"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-cream/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-sans font-semibold text-jaggery border border-jaggery/10">
                    Bele Obbattu · ಬೇಳೆ ಒಬ್ಬಟ್ಟು
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. ROOTED IN HASSAN
            ======================================================== */}
        <section className="py-16 md:py-24 bg-cream border-b border-jaggery/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* Left Column: Story */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-chilli font-sans">
                  <MapPin className="w-4 h-4" />
                  <span>REGIONAL ORIGIN · ಹಾಸನದ ಹೆಮ್ಮೆ</span>
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-jaggery tracking-tight">
                  A little piece of Hassan.
                </h2>

                <div className="font-sans text-base text-jaggery-muted space-y-4 leading-relaxed">
                  <p>
                    Nestled between the misty hills of the Western Ghats and the fertile plains of southern
                    Karnataka, Hassan has always held a special culinary identity. It is a region shaped by
                    artisan heritage and a culture of welcoming travellers with warm plates of fresh thindi.
                  </p>
                  <p>
                    In households across the district, snack-making is guided by time-tested proportions — handfuls
                    of stone-ground flours, fresh curry leaves from backyard gardens, and the gentle crackle of seasoned
                    frying pans.
                  </p>
                  <p className="text-sm font-medium text-jaggery border-l-2 border-chilli pl-4 italic">
                    THINDI was created to bring this culinary heritage — honest, unhurried, and authentic — from our
                    ooru straight to your table.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-3 text-xs font-mono text-jaggery-muted">
                  <div className="px-3.5 py-2 rounded-md bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery font-sans">Origin</strong>
                    <span>Hassan, Karnataka</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-md bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery font-sans">Craft</strong>
                    <span>Traditional recipes</span>
                  </div>
                  <div className="px-3.5 py-2 rounded-md bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery font-sans">Packaging</strong>
                    <span>Airtight sealed pouches</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Artisan Visual Composition */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-xl overflow-hidden border border-jaggery/15 shadow-md aspect-[4/5] bg-cream-dark">
                  <Image
                    src="/images/story/story-handcraft.jpg"
                    alt="Artisan hands shaping traditional snacks with precision and care"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jaggery/80 via-transparent to-transparent flex flex-col justify-end p-6 text-cream">
                    <span className="font-kannada text-base font-semibold text-turmeric">
                      ಪಾರಂಪರಿಕ ಕೈಚಳಕ
                    </span>
                    <p className="font-sans text-xs italic mt-1 text-cream/80">
                      Handcrafted with care, patience, and regional pride.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            4. SNACK TEXTURES & TRADITIONAL FORMS (Photo Strip)
            ======================================================== */}
        <section className="py-16 md:py-24 bg-jaggery text-cream relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-turmeric font-sans">
                <Heart className="w-3.5 h-3.5 text-chilli" />
                <span>SHARING TRADITIONS · ಹಂಚಿ ತಿನ್ನುವ ಸಂಭ್ರಮ</span>
              </span>

              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-cream">
                &ldquo;The best thindi is the kind we share.&rdquo;
              </h2>

              <p className="font-sans text-base text-cream/75 max-w-xl mx-auto leading-relaxed">
                Whether it is unboxing a gift parcel, passing the tin around during evening conversations,
                or stocking the festival pantry — traditional snacks were always meant to be enjoyed together.
              </p>
            </div>

            {/* Varied Texture Ratios Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 group">
                <Image
                  src="/images/products/nippattu.jpg"
                  alt="Crunchy spiced Nippattu with whole roasted peanuts"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-jaggery/85 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-cream">
                  Nippattu · ನಿಪ್ಪಟ್ಟು
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 group">
                <Image
                  src="/images/products/kajjaya.jpg"
                  alt="Deep golden mahogany Kajjaya sweets studded with sesame"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-jaggery/85 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-cream">
                  Kajjaya · ಕಜ್ಜಾಯ
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cream/15 group">
                <Image
                  src="/images/products/sandige.jpg"
                  alt="Sun-dried crisp Akki Sandige"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-jaggery/85 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-cream">
                  Akki Sandige · ಸಂಡಿಗೆ
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            5. SHOPPING CTA
            ======================================================== */}
        <section className="py-16 md:py-20 bg-cream border-t border-jaggery/10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-chilli font-sans">
              TASTE THE HERITAGE
            </span>

            <h2 className="font-display font-black text-3xl sm:text-4xl text-jaggery tracking-tight">
              Craving something familiar?
            </h2>

            <p className="font-sans text-base text-jaggery-muted max-w-lg mx-auto leading-relaxed">
              From crisp savouries to seasonal sweets and pickles, explore authentic Karnataka flavours crafted in Hassan.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Button
                variant="primary"
                size="md"
                href="/shop"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Explore All Thindi
              </Button>
              <Button
                variant="outline"
                size="md"
                href="/combos"
                className="w-full sm:w-auto"
              >
                Browse Gift Boxes
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
