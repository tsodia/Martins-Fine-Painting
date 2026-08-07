import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import BeforeAfter from "@/components/BeforeAfter";
import HomeHero from "./HomeHero";
import HomeContactForm from "./HomeContactForm";

export const metadata: Metadata = {
  title: "Martin's Fine Painting — Denver's Premier Luxury Painting Company",
  description:
    "Where Craftsmanship Meets Perfection. 35+ years of bespoke brushwork from a one-man custom artist. Luxury interior painting, built-in refinishing, and specialty finishes across the Denver Metro Area.",
  alternates: {
    canonical: "https://martinsfinepainting.com",
  },
};

function GoldStars() {
  return (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

const trustItems = [
  { label: "35+ Years Experience", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gold"><rect x="2" y="3" width="16" height="5" rx="1" /><path d="M18 5h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1" /><path d="M13 8v3a1 1 0 0 1-1 1H4" /><path d="M4 12v8a1 1 0 0 0 2 0v-8" /></svg> },
  { label: "Fully Licensed & Insured", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gold"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg> },
  { label: "5-Star Rated", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gold"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> },
  { label: "Denver\u2019s #1 Luxury Painter", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gold"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg> },
];

const services = [
  { title: "Interior Painting", description: "Every room deserves a flawless finish. From single accent walls to full-home transformations, we deliver color with surgical precision.", href: "/services", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold"><rect x="2" y="3" width="16" height="5" rx="1" /><path d="M18 5h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1" /><path d="M13 8v3a1 1 0 0 1-1 1H4" /><path d="M4 12v8a1 1 0 0 0 2 0v-8" /></svg> },

  { title: "Cabinet & Built-In Refinishing", description: "Hand-rolled, furniture-grade finishes that lay down smoother than spray. Our specialty \u2014 see the gallery for proof.", href: "/gallery", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 12h18" /><path d="M12 3v18" /><path d="M10 7.5H8" /><path d="M16 7.5h-2" /><path d="M10 16.5H8" /><path d="M16 16.5h-2" /></svg> },
  { title: "Specialty Finishes", description: "From dramatic accent walls to two-tone built-ins and custom color work, we bring your unique vision to life.", href: "/services", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-gold"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" /><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg> },
];

const whyBlocks = [
  { title: "35 Years of Mastery", description: "Three and a half decades of perfecting our craft. We\u2019ve painted thousands of Denver homes and we bring that expertise to every job." },
  { title: "White-Glove Service", description: "Drop cloths on every surface. Furniture moved and protected. Your home treated with more care than our own." },
  { title: "Premium Materials Only", description: "We use the finest paints and coatings available \u2014 Benjamin Moore, Sherwin-Williams Duration, and specialty finishes. No cutting corners." },
  { title: "Our Guarantee", description: "If it\u2019s not perfect, we\u2019re not done. We don\u2019t leave until every line is crisp, every surface is flawless, and you\u2019re completely satisfied." },
];

const testimonials = [
  { quote: "Martin transformed our entire library with custom built-in shelving \u2014 floor to ceiling. The two-tone finish was absolutely flawless. We couldn\u2019t be happier.", name: "Sarah K.", location: "Cherry Hills Village", project: "Custom Built-Ins" },
  { quote: "We hired Martin for our fireplace wall and entertainment center. The attention to detail on the cabinetry was extraordinary. It looks like it came out of a magazine.", name: "James R.", location: "Highlands Ranch", project: "Fireplace & Built-Ins" },
  { quote: "35 years of experience shows. Martin personally assessed our project and delivered perfection. Our bathroom looks like a luxury spa now.", name: "Michelle T.", location: "Greenwood Village", project: "Interior Painting" },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeHero />

        {/* TRUST BAR */}
        <section className="bg-cream py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {trustItems.map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-3">
                  {item.icon}
                  <span className="font-semibold text-deep-black text-sm tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED BEFORE & AFTER */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-6">
            <FadeIn><div className="text-center mb-12"><h2 className="font-serif text-3xl md:text-4xl text-deep-black mb-4">See the Transformation</h2><div className="w-16 h-0.5 bg-gold mx-auto" /></div></FadeIn>
            <FadeIn>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <BeforeAfter beforeSrc="/images/gallery/bookshelf-brick-fireplace-before.jpg" afterSrc="/images/gallery/bookshelf-brick-fireplace-after.jpg" beforeAlt="Custom built-in bookshelf and fireplace before painting — raw wood shelves and white brick" afterAlt="Custom built-in bookshelf and fireplace after a stunning two-tone finish by Martin's Fine Painting" />
              </div>
              <p className="text-center mt-6 text-gray-600 text-sm md:text-base"><span className="font-serif font-semibold text-deep-black">Custom Built-In Bookshelf &amp; Fireplace</span> &mdash; From raw construction to a stunning two-tone finish</p>
            </FadeIn>
            <FadeIn><div className="text-center mt-8"><Link href="/gallery" className="inline-flex items-center gap-2 text-gold font-semibold hover:text-gold-soft transition">View More Projects <span aria-hidden="true">&rarr;</span></Link></div></FadeIn>
          </div>
        </section>

        {/* SERVICES OVERVIEW */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn><div className="text-center mb-14"><h2 className="font-serif text-3xl md:text-4xl text-deep-black mb-4">Precision. Protection. Perfection.</h2><div className="w-16 h-0.5 bg-gold mx-auto" /></div></FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <FadeIn key={service.title} delay={i as 0 | 1 | 2 | 3}>
                  <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <div className="mb-5">{service.icon}</div>
                    <h3 className="font-serif text-xl text-deep-black mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">{service.description}</p>
                    <Link href={service.href} className="inline-flex items-center gap-1 text-gold font-semibold text-sm mt-5 hover:text-gold-soft transition">Learn More <span aria-hidden="true">&rarr;</span></Link>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn><p className="text-center text-gray-500 mt-12 max-w-2xl mx-auto">From meticulous prep work to the final brushstroke, Martin&apos;s Fine Painting treats every project like a masterpiece.</p></FadeIn>
          </div>
        </section>

        {/* WHY MARTIN'S */}
        <section className="bg-cream py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn><div className="text-center mb-14"><h2 className="font-serif text-3xl md:text-4xl text-deep-black mb-4">Why Denver Trusts Martin&apos;s</h2><div className="w-16 h-0.5 bg-gold mx-auto" /></div></FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
              {whyBlocks.map((block, i) => (
                <FadeIn key={block.title} delay={i as 0 | 1 | 2 | 3}>
                  <div><div className="w-12 h-0.5 bg-gold mb-4" /><h3 className="font-serif text-xl text-deep-black mb-3">{block.title}</h3><p className="text-gray-600 leading-relaxed">{block.description}</p></div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-navy py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn><div className="text-center mb-14"><h2 className="font-serif text-3xl md:text-4xl text-white mb-4">What Our Clients Say</h2><div className="w-16 h-0.5 bg-gold mx-auto" /></div></FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <FadeIn key={t.name} delay={i as 0 | 1 | 2 | 3}>
                  <div className="bg-white/10 backdrop-blur p-6 rounded-xl h-full flex flex-col">
                    <GoldStars />
                    <blockquote className="text-white italic leading-relaxed flex-grow">&ldquo;{t.quote}&rdquo;</blockquote>
                    <div className="mt-5 pt-4 border-t border-white/10"><p className="text-gold-soft font-semibold text-sm">{t.name}, <span className="font-normal">{t.location}</span></p><p className="text-white/50 text-xs mt-1">{t.project}</p></div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <FadeIn><p className="text-white/70 text-center mt-12 text-sm">Trusted by Denver&apos;s finest homes for over three decades.</p></FadeIn>
          </div>
        </section>

        {/* CONVERSION CTA */}
        <section className="bg-charcoal py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <FadeIn><div className="text-center mb-12"><h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Ready to Transform Your Space?</h2><p className="text-white/80 max-w-2xl mx-auto leading-relaxed">Every project begins with a free, no-pressure consultation. We&apos;ll assess your space, discuss your vision, and provide a detailed proposal &mdash; no surprises, no hidden fees.</p></div></FadeIn>
            <FadeIn><HomeContactForm /></FadeIn>
            <FadeIn><div className="flex items-center justify-center gap-2 mt-8"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gold flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg><p className="text-gold text-sm font-medium italic">&ldquo;If it&apos;s not perfect, we&apos;re not done.&rdquo;</p></div></FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
