"use client";

import { useState, FormEvent } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import EstimateResult, { CustomerEstimate } from "@/components/EstimateResult";

const SERVICE_OPTIONS = [
  "Interior Painting",
  "Cabinet & Built-In Refinishing",
  "Commercial",
  "Specialty Finishes",
  "Not Sure",
];

const HOW_FOUND_OPTIONS = [
  "Google",
  "Referral",
  "Nextdoor",
  "Social Media",
  "Drove By a Job Site",
  "Other",
];

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [estimate, setEstimate] = useState<CustomerEstimate | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const htmlFormData = new FormData(e.currentTarget);
    const submitData = new FormData();
    submitData.append("name", htmlFormData.get("name") as string);
    submitData.append("email", htmlFormData.get("email") as string);
    submitData.append("phone", htmlFormData.get("phone") as string);
    submitData.append("address", htmlFormData.get("address") as string);
    submitData.append("serviceInterest", htmlFormData.get("serviceInterest") as string);
    submitData.append("projectDescription", htmlFormData.get("projectDescription") as string);
    submitData.append("howFoundUs", htmlFormData.get("howFoundUs") as string);
    submitData.append("sourcePage", "Contact");
    photos.forEach((file) => submitData.append("photos", file));

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        body: submitData,
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const json = await res.json().catch(() => null);
      setEstimate(json?.estimate ?? null);
      setIsSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-cream rounded-xl p-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto mb-4">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3 className="font-serif text-2xl text-deep-black mb-2">Thank You!</h3>
        <p className="text-gray-600">
          We&apos;ve received your request. A member of our team will reach out
          within 24 hours to schedule your free consultation.
        </p>
        {estimate && <EstimateResult estimate={estimate} variant="light" />}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            required
            placeholder="Your full name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
            name="email"
            required
            placeholder="you@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contact-phone"
            name="phone"
            required
            placeholder="(303) 555-0123"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="contact-address" className="block text-sm font-medium text-gray-700 mb-1.5">
            Address / Zip Code
          </label>
          <input
            type="text"
            id="contact-address"
            name="address"
            placeholder="Address or zip code"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 mb-1.5">
            Service Interest <span className="text-red-500">*</span>
          </label>
          <select
            id="contact-service"
            name="serviceInterest"
            required
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          >
            <option value="" disabled>Select a service...</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-found" className="block text-sm font-medium text-gray-700 mb-1.5">
            How did you hear about us?
          </label>
          <select
            id="contact-found"
            name="howFoundUs"
            defaultValue=""
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
          >
            <option value="" disabled>Select an option...</option>
            {HOW_FOUND_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-desc" className="block text-sm font-medium text-gray-700 mb-1.5">
          Project Description
        </label>
        <textarea
          id="contact-desc"
          name="projectDescription"
          rows={5}
          placeholder="Tell us about your project — rooms, surfaces, timeline, anything that helps us understand your vision."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold resize-none"
        />
      </div>

      <PhotoUpload idPrefix="contact" variant="light" onFilesChange={setPhotos} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-gold text-deep-black font-semibold px-8 py-4 rounded hover:bg-gold-soft transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto"
      >
        {isSubmitting ? "Sending..." : "Request My Free Consultation"}
      </button>

      <p className="text-gray-500 text-sm">
        We respond to every inquiry within 24 hours.
      </p>
    </form>
  );
}
