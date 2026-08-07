"use client";

import { useState, FormEvent } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import EstimateResult, { CustomerEstimate } from "@/components/EstimateResult";

const SERVICE_OPTIONS = [
  "Interior Painting",
  "Cabinet & Built-In Refinishing",
  "Commercial",
  "Specialty Finishes",
  "Other",
];

export default function HomeContactForm() {
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
    submitData.append("serviceInterest", htmlFormData.get("serviceInterest") as string);
    submitData.append("projectDescription", htmlFormData.get("projectDescription") as string);
    submitData.append("sourcePage", "Home - CTA Block");
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
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-gold mx-auto mb-4">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <h3 className="font-serif text-2xl text-white mb-2">Thank You!</h3>
        <p className="text-white/70">
          We&apos;ve received your request. A member of our team will reach out
          within 24 hours to schedule your free consultation.
        </p>
        {estimate && <EstimateResult estimate={estimate} variant="dark" />}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cta-name" className="block text-white/70 text-sm mb-2 font-medium">Name</label>
          <input type="text" id="cta-name" name="name" required placeholder="Your full name" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
        </div>
        <div>
          <label htmlFor="cta-email" className="block text-white/70 text-sm mb-2 font-medium">Email</label>
          <input type="email" id="cta-email" name="email" required placeholder="you@email.com" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
        </div>
        <div>
          <label htmlFor="cta-phone" className="block text-white/70 text-sm mb-2 font-medium">Phone</label>
          <input type="tel" id="cta-phone" name="phone" required placeholder="(303) 555-0123" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
        </div>
        <div>
          <label htmlFor="cta-service" className="block text-white/70 text-sm mb-2 font-medium">Service Interest</label>
          <select id="cta-service" name="serviceInterest" required defaultValue="" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition">
            <option value="" disabled className="text-gray-900">Select a service</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="text-gray-900">{opt}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="cta-desc" className="block text-white/70 text-sm mb-2 font-medium">Brief Project Description</label>
          <textarea id="cta-desc" name="projectDescription" rows={4} placeholder="Tell us about your project — rooms, surfaces, timeline, anything that helps us understand your vision." className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition resize-none" />
        </div>
        <div className="md:col-span-2">
          <PhotoUpload idPrefix="cta" variant="dark" onFilesChange={setPhotos} />
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <div className="mt-6">
        <button type="submit" disabled={isSubmitting} className="bg-gold text-deep-black font-semibold px-8 py-4 rounded hover:bg-gold-soft transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed w-full md:w-auto">
          {isSubmitting ? "Sending..." : "Request My Free Consultation"}
        </button>
      </div>
    </form>
  );
}
