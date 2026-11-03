import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';
import { ChakkaliMotif } from '@/components/brand/ChakkaliMotif';
import { ArrowRight, MapPin, Sparkles, Heart, Coffee } from 'lucide-react';

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

const TRADITIONAL_FOODS = [
  {
    name: 'Chakkali',
    kannadaName: 'ಚಕ್ಕುಲಿ',
    slug: 'chakkali',
    imageSrc: '/images/products/chakkali.jpg',
    collectionSlug: 'kuruk-thindi',
    story:
      'Pressed through a brass chakli-maker with a star aperture, coiled into gentle concentric spirals, and fried slowly until pale golden. Every ripple holds crisp texture, roasted cumin, and fragrant sesame seeds.',
    moment: 'The timeless 4 PM coffee companion',
  },
  {
    name: 'Kodubale',
    kannadaName: 'ಕೋಡುಬಳೆ',
    slug: 'kodubale',
    imageSrc: '/images/products/kodubale.jpg',
    collectionSlug: 'kuruk-thindi',
    story:
      'Hand-shaped into crescent rings with tender fresh coconut, roasted ajwain, and coarse red chilli. A brittle, hollow crunch that breaks cleanly with a burst of fragrant carom and pepper.',
    moment: 'Evening rains and conversations',
  },
  {
    name: 'Nippattu',
    kannadaName: 'ನಿಪ್ಪಟ್ಟು',
    slug: 'nippattu',
    imageSrc: '/images/products/nippattu.jpg',
    collectionSlug: 'kuruk-thindi',
    story:
      'Flat disc crackers studded with roasted whole groundnuts, fried gram, and curry leaves. Robust, earthy, and distinctly spiced with local byadgi chilli for warmth that lingers gently.',
    moment: 'Travel snack & festive tiffin tins',
  },
  {
    name: 'Obbattu',
    kannadaName: 'ಒಬ್ಬಟ್ಟು / ಹೋಳಿಗೆ',
    slug: 'sihi-thindi',
    imageSrc: '/images/categories/sihi-thindi.jpg',
    collectionSlug: 'sihi-thindi',
    story:
      'Paper-thin flatbreads rolled with sweet jaggery-coconut or chana dal stuffing, griddled with pure cow ghee on a seasoned cast-iron tava. The undisputed centerpiece of festive feasts.',
    moment: 'Ugadi feasts and milestone moments',
  },
  {
    name: 'Appala & Sandige',
    kannadaName: 'ಅಪ್ಪಳ ಮತ್ತು ಸಂಡಿಗೆ',
    slug: 'appala-sandige',
    imageSrc: '/images/categories/appala-sandige.jpg',
    collectionSlug: 'appala-sandige',
    story:
      'Prepared during the hot Karnataka summer months. Steamed rice flour and sago paste extruded onto white cotton sarees and dried under the bright Deccan sun, ready to puff instantly in hot oil.',
    moment: 'Sunday afternoon bisi bele bath accompaniments',
  },
  {
    name: 'Uppinakai',
    kannadaName: 'ಉಪ್ಪಿನಕಾಯಿ',
    slug: 'mango-uppinakai',
    imageSrc: '/images/products/mango-uppinakai.jpg',
    collectionSlug: 'uppinakai',
    story:
      'Tender Malnad raw mango chunks salted in ceramic bharanis (jars), steeped with cold-pressed gingelly oil, freshly roasted mustard powder, and fenugreek. Tangy, sharp, and intensely aromatic.',
    moment: 'Curd rice comfort at dinner',
  },
];

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-cream text-jaggery antialiased flex flex-col selection:bg-chilli/15">
      <Header />

      <main className="flex-1">
        {/* ========================================================
            SECTION 1: CINEMATIC INTRO
            ======================================================== */}
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-jaggery/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chilli/10 border border-chilli/20 text-xs font-semibold uppercase tracking-widest text-chilli mb-6">
                <MapPin className="w-3.5 h-3.5" />
                <span>OUR ROOTS · HASSAN, KARNATAKA</span>
                <span className="text-chilli/40 font-normal">|</span>
                <span className="font-kannada font-normal normal-case">ಹಾಸನದ ಮಣ್ಣಿನ ರುಚಿ</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-jaggery tracking-tight leading-[1.1]">
                Good thindi.
                <span className="block text-chilli">Great memories.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 font-sans text-base sm:text-xl text-jaggery/80 leading-relaxed max-w-2xl">
                Some flavours stay with us. The familiar crunch of chakkali, the spice of uppinakai,
                and the little treats that bring everyone together around the dining table, the kitchen counter,
                or a steaming steel tumbler of filter coffee.
              </p>
            </div>

            {/* Editorial Hero Photograph */}
            <div className="mt-12 sm:mt-16 relative rounded-2xl overflow-hidden border border-jaggery/15 shadow-sm aspect-16/10 sm:aspect-21/9 bg-cream-dark">
              <Image
                src="/images/story/story-heritage.jpg"
                alt="Traditional brass plates with authentic Karnataka handmade savouries and filter coffee"
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-jaggery/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
                <p className="font-serif text-cream text-lg sm:text-2xl font-medium italic max-w-xl">
                  "Every snack tells the story of an afternoon spent waiting by the stove for the first crisp batch."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: THE FOODS WE GREW UP WITH (Magazine Editorial)
            ======================================================== */}
        <section className="py-16 md:py-24 bg-[#FAF5EC] border-b border-jaggery/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-turmeric font-sans">
                  TRADITIONAL PANTRY CLASSICS · ತಿಂಡಿ ವೈವಿಧ್ಯ
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery mt-2">
                  The Foods We Grew Up With
                </h2>
              </div>
              <p className="text-sm font-sans text-jaggery/70 max-w-md">
                Recipes preserved through generations, made with stone-ground flours, cold-pressed oils, and zero shortcuts.
              </p>
            </div>

            {/* Magazine Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TRADITIONAL_FOODS.map((item, idx) => (
                <article
                  key={item.name}
                  className="group bg-cream rounded-xl border border-jaggery/15 overflow-hidden shadow-xs hover:border-chilli/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-cream-dark">
                      <Image
                        src={item.imageSrc}
                        alt={`${item.name} traditional Karnataka snack`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-cream/90 backdrop-blur-xs text-[11px] font-mono font-bold text-jaggery border border-jaggery/10">
                        0{idx + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-serif text-xl font-bold text-jaggery group-hover:text-chilli transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-kannada text-sm text-chilli/90 font-medium">
                          {item.kannadaName}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-leaf uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5" />
                        <span>{item.moment}</span>
                      </p>

                      <p className="font-sans text-xs sm:text-sm text-jaggery/75 mt-3 leading-relaxed">
                        {item.story}
                      </p>
                    </div>
                  </div>

                  {/* Footer link */}
                  <div className="px-6 pb-6 pt-2 border-t border-jaggery/5 flex items-center justify-between">
                    <Link
                      href={`/collections/${item.collectionSlug}`}
                      className="text-xs font-semibold text-chilli hover:text-jaggery inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: ROOTED IN HASSAN
            ======================================================== */}
        <section className="py-16 md:py-24 bg-cream border-b border-jaggery/10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: Story */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-chilli font-sans">
                  <MapPin className="w-4 h-4" />
                  <span>REGIONAL GEOGRAPHY · ಹಾಸನದ ಹೆಮ್ಮೆ</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-jaggery tracking-tight">
                  A little piece of Hassan.
                </h2>

                <div className="font-sans text-base sm:text-lg text-jaggery/80 space-y-4 leading-relaxed">
                  <p>
                    Nestled between the misty coffee hills of the Western Ghats and the fertile plains of southern
                    Karnataka, Hassan has always held a special culinary identity. It is a land shaped by rich red soil,
                    artisan heritage, and a legendary culture of welcoming travellers with warm plates of fresh thindi.
                  </p>
                  <p>
                    In households across the district, recipes are not measured with digital scales, but with time-honoured
                    handfuls of stone-ground flours, fresh curry leaves picked straight from kitchen gardens, and the slow,
                    gentle hum of frying pans seasoned over decades.
                  </p>
                  <p className="text-sm font-medium text-jaggery border-l-2 border-chilli pl-4 italic">
                    THINDI was founded to bring this very culinary heritage — honest, unhurried, and authentic — from our
                    ooru straight to homes across Karnataka.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-jaggery/70">
                  <div className="px-3 py-2 rounded-lg bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery">Origin Town</strong>
                    <span>Hassan, Karnataka (573201)</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery">Cooking Tradition</strong>
                    <span>Small batch, wood-pressed oils</span>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-cream-dark border border-jaggery/10">
                    <strong className="block text-jaggery">Packaging</strong>
                    <span>Hermetically sealed for crispiness</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Artisan Visual Composition */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-jaggery/15 shadow-md aspect-4/5 bg-cream-dark">
                  <Image
                    src="/images/story/story-handcraft.jpg"
                    alt="Artisan hands rolling and pressing traditional snacks in Hassan kitchen"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-jaggery/70 via-transparent to-transparent flex flex-col justify-end p-6 text-cream">
                    <span className="font-kannada text-base font-semibold text-turmeric">
                      ಪಾರಂಪರಿಕ ಕೈಚಳಕ
                    </span>
                    <p className="font-serif text-sm italic mt-1 text-cream/90">
                      Handcrafted with care, patience, and age-old culinary craft.
                    </p>
                  </div>
                </div>

                {/* Decorative Chakkali Motif floating */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 text-chilli/20 pointer-events-none hidden sm:block">
                  <ChakkaliMotif className="w-full h-full animate-spin-slow" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: MADE TO BE SHARED
            ======================================================== */}
        <section className="py-16 md:py-24 bg-jaggery text-cream relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-turmeric font-sans">
                <Heart className="w-3.5 h-3.5 text-chilli" />
                <span>SHARING TRADITIONS · ಹಂಚಿ ತಿನ್ನುವ ಸಂಭ್ರಮ</span>
              </span>

              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream leading-tight">
                "The best thindi is the kind we share."
              </h2>

              <p className="font-sans text-base sm:text-lg text-cream/80 max-w-xl mx-auto leading-relaxed">
                Whether it's unboxing a surprise parcel sent to a hostel room, passing the dabba around during evening
                card games, or stocking the festive pantry for family visits — traditional snacks were always meant to be
                enjoyed together.
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-turmeric/40" />
                <span className="font-kannada text-turmeric text-lg font-medium">
                  ಒಟ್ಟಿಗೆ ಸವಿಯೋಣ
                </span>
                <div className="h-px w-12 bg-turmeric/40" />
              </div>
            </div>

            {/* Photo Trio Strip */}
            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-cream/15">
                <Image
                  src="/images/behind/macro-chakkali.jpg"
                  alt="Golden crisp spiral chakkali texture"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-cream/15">
                <Image
                  src="/images/story/story-texture.jpg"
                  alt="Traditional spices and stone-ground flours"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-cream/15">
                <Image
                  src="/images/behind/macro-kodubale.jpg"
                  alt="Crunchy golden kodubale rings"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: SHOPPING CTA
            ======================================================== */}
        <section className="py-16 md:py-24 bg-cream border-t border-jaggery/10 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-chilli font-sans">
              TASTE THE HERITAGE
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-jaggery tracking-tight">
              Craving something familiar?
            </h2>

            <p className="font-sans text-base sm:text-lg text-jaggery/75 max-w-xl mx-auto leading-relaxed">
              From crisp savouries to seasonal sun-dried delicacies, discover the flavours of Hassan delivered across
              Karnataka.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-chilli text-cream font-sans font-bold text-sm hover:bg-[#8B3326] transition-colors shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore THINDI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/combos"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-jaggery/20 bg-cream-dark text-jaggery font-sans font-semibold text-sm hover:bg-[#EFE5D5] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Browse Gift Boxes</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

