"use client";

import { useState } from "react";
import FadeIn from "./FadeIn";

const faqs = [
  {
    question: "How much does it cost to paint my home?",
    answer:
      "Every home is different — that's why we never give cookie-cutter quotes. We provide a free on-site consultation where we assess your specific space, discuss your goals, and deliver a detailed, transparent proposal. No surprises, no hidden fees.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We serve the entire Denver Metro Area including Denver, Lakewood, Littleton, Englewood, Cherry Hills Village, Greenwood Village, Highlands Ranch, Parker, Castle Rock, Arvada, Golden, Boulder, and surrounding communities.",
  },
  {
    question: "What makes Martin's different from other painters?",
    answer:
      "35+ years of experience, an obsessive attention to detail, and a guarantee that Martin won't leave until the job is perfect. He uses only premium materials, preps like a surgeon, and personally handles every project from start to finish. This isn't a side hustle — it's a legacy.",
  },
  {
    question: "Do you spray cabinets?",
    answer:
      "No, and that's deliberate. Martin hand-rolls every cabinet and built-in with a technique refined over 35 years. The finish lays down smoother than spray, with no overspray on your counters, no dust cloud, and no plastic sheeting over half your house. Look closely at the gallery photos: that glass-smooth finish is done entirely by hand.",
  },
  {
    question: "What paint brands do you use?",
    answer:
      "We use top-tier products from Benjamin Moore, Sherwin-Williams (Duration and Emerald lines), and specialty finishes as needed. We'll recommend the best product for your specific project — no cheap shortcuts.",
  },
  {
    question: "How long will my project take?",
    answer:
      "Timelines depend on the scope. A single room might take 1–2 days, a full interior 1–2 weeks, and a full cabinet refinishing project 1–2 weeks depending on size and prep needs. We'll give you a clear timeline upfront and stick to it.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Absolutely. Martin's Fine Painting is fully licensed and insured. Your home is fully protected.",
  },
  {
    question: "Do you offer a guarantee?",
    answer:
      "Yes. \"If it's not perfect, we're not done.\" We stand behind every project with a satisfaction guarantee. If something isn't right, we come back and make it right — no questions asked.",
  },
  {
    question: "Can you help me choose colors?",
    answer:
      "Yes — we offer color consultation as part of our process. We'll help you choose the perfect palette for your space, lighting, and style. We also provide sample applications so you can see colors on your actual walls before committing.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <FadeIn key={i}>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-deep-black pr-4">{faq.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
