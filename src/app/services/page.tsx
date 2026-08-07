import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";
import FAQ from "@/components/FAQ";
import ServiceCTA from "./ServiceCTA";

export const metadata: Metadata = {
  title: "Services — Interior Painting, Cabinet Refinishing & More",
  description:
    "Comprehensive painting solutions from a one-man custom artist with 35+ years of experience. Interior painting, cabinet refinishing, commercial, and specialty finishes across the Denver Metro Area.",
  alternates: {
    canonical: "https://martinsfinepainting.com/services",
  },
};

const services = [
  {
    title: "Interior Painting",
    description:
      "Every room deserves a flawless finish. Whether it's a single accent wall, a full-home repaint, or detailed trim and molding work — we deliver color with surgical precision. From ceilings and hallways to stairwells and bedrooms, our team transforms interiors with meticulous attention to every edge, corner, and surface.",
    includes: [
      "Complimentary color consultation",
      "Full prep — patching, sanding, priming, caulking",
      "Premium paint application (brush, roll, or spray as needed)",
      "Trim, molding, and baseboard detail work",
      "Thorough cleanup — we leave your home spotless",
    ],
    cta: "Starting from a free consultation — no cookie-cutter quotes.",
    bg: "bg-cream",
  },

  {
    title: "Commercial Painting",
    description:
      "Offices, retail spaces, restaurants, HOA common areas, and tenant improvements — we paint spaces that elevate your brand. We understand that downtime costs money, so we work around your business with flexible scheduling including nights and weekends. Minimal disruption, maximum impact.",
    includes: [
      "Flexible scheduling — nights, weekends, phased work",
      "Fast turnarounds without compromising quality",
      "Large-scale interior capabilities",
      "HOA common area and multi-unit expertise",
      "Detailed project management and communication",
    ],
    cta: "We work around your business so your business never stops.",
    bg: "bg-white",
  },
  {
    title: "Cabinet & Built-In Refinishing",
    description:
      "Transform dated kitchens, bathroom vanities, and built-ins without the cost of a full remodel. Every cabinet is finished by hand: rolled, never sprayed, with a technique Martin has refined over 35 years. The finish lays down smoother than spray, with no overspray on your counters, no dust cloud, and no plastic sheeting over half your home. This is our specialty, and our gallery proves it.",
    includes: [
      "Kitchen cabinets, bathroom vanities, and built-ins",
      "Hand-rolled, furniture-grade finish that outperforms spray",
      "Custom color matching and multi-tone options",
      "Hardware removal and reinstallation",
    ],
    cta: "The transformation will exceed your expectations.",
    bg: "bg-cream",
  },
  {
    title: "Specialty Finishes",
    description:
      "For homeowners who want something truly unique. From faux finishes and Venetian plaster to limewash, accent murals, textured walls, and epoxy garage floors — we bring your vision to life with artisan-level craftsmanship. These are the details that make a home extraordinary.",
    includes: [
      "Faux finishes and decorative techniques",
      "Venetian plaster and limewash applications",
      "Accent walls and custom color work",
      "Textured wall treatments",
      "Epoxy garage floor coatings",
    ],
    cta: "Tell us your vision — we'll make it real.",
    bg: "bg-cream",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        {/* HERO */}
        <section
          className="relative flex items-center justify-center pt-32 pb-20 md:pt-40 md:pb-28"
          style={{
            background: "linear-gradient(135deg, #1a2744 0%, #243356 50%, #1a2744 100%)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.05)_0%,_transparent_70%)]" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Our Services
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Comprehensive painting solutions for Denver&apos;s most discerning homeowners and businesses.
            </p>
            <div className="mt-8">
              <ServiceCTA label="Get a Free Estimate" />
            </div>
          </div>
        </section>

        {/* SERVICE SECTIONS */}
        {services.map((service) => (
          <section key={service.title} className={`${service.bg} py-12 md:py-20`}>
            <div className="max-w-5xl mx-auto px-6">
              <FadeIn>
                <div className="w-12 h-0.5 bg-gold mb-6" />
                <h2 className="font-serif text-3xl md:text-4xl text-deep-black mb-6">
                  {service.title}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg mb-8 max-w-3xl">
                  {service.description}
                </p>
              </FadeIn>

              <FadeIn>
                <div className="bg-white border border-gray-100 rounded-xl p-6 md:p-8 shadow-sm mb-8">
                  <h3 className="font-semibold text-deep-black mb-4">What&apos;s Included:</h3>
                  <ul className="space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gold flex-shrink-0 mt-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              <FadeIn>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-gray-500 italic">{service.cta}</p>
                  <ServiceCTA label={`Request a Quote for ${service.title}`} />
                </div>
              </FadeIn>
            </div>
          </section>
        ))}

        {/* FAQ */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <h2 className="font-serif text-3xl md:text-4xl text-deep-black mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="w-16 h-0.5 bg-gold mx-auto" />
              </div>
            </FadeIn>
            <FAQ />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="bg-charcoal py-12 md:py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Not sure what you need? No problem.
              </h2>
              <p className="text-white/80 leading-relaxed mb-8">
                Schedule a free walk-through and we&apos;ll recommend exactly what your space needs.
              </p>
              <ServiceCTA label="Book Your Free Consultation" />
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
