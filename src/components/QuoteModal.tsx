"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import EstimateResult, { CustomerEstimate } from "@/components/EstimateResult";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePage?: string;
}

const SERVICE_OPTIONS = [
  "Interior Painting",
  "Cabinet & Built-In Refinishing",
  "Commercial",
  "Fireplace & Entertainment Centers",
  "Specialty Finishes",
  "Not Sure",
] as const;

export default function QuoteModal({ isOpen, onClose, sourcePage = "Modal" }: QuoteModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "",
    projectDescription: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [estimate, setEstimate] = useState<CustomerEstimate | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => closeRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("serviceInterest", formData.serviceInterest);
    submitData.append("projectDescription", formData.projectDescription);
    submitData.append("sourcePage", sourcePage);
    photos.forEach((file) => submitData.append("photos", file));

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        body: submitData,
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      const json = await res.json().catch(() => null);
      setEstimate(json?.estimate ?? null);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", serviceInterest: "", projectDescription: "" });
      setPhotos([]);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={modalRef} className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-600">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy">Thank You!</h3>
            <p className="mt-2 text-gray-600">We&rsquo;ve received your consultation request and will be in touch within 24 hours.</p>
            {estimate && <EstimateResult estimate={estimate} variant="light" />}
            <button type="button" onClick={onClose} className="mt-6 rounded-full bg-gold px-6 py-2.5 font-semibold text-deep-black transition-colors hover:bg-gold-soft">
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 id="quote-modal-title" className="pr-8 font-serif text-2xl font-bold text-navy">
              Request Your Free Consultation
            </h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="modal-name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                <input id="modal-name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold" placeholder="Your full name" />
              </div>
              <div>
                <label htmlFor="modal-email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input id="modal-email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold" placeholder="you@example.com" />
              </div>
              <div>
                <label htmlFor="modal-phone" className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                <input id="modal-phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold" placeholder="(303) 555-0000" />
              </div>
              <div>
                <label htmlFor="modal-service" className="mb-1 block text-sm font-medium text-gray-700">Service Interest</label>
                <select id="modal-service" name="serviceInterest" required value={formData.serviceInterest} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold">
                  <option value="" disabled>Select a service...</option>
                  {SERVICE_OPTIONS.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="modal-desc" className="mb-1 block text-sm font-medium text-gray-700">Brief Project Description</label>
                <textarea id="modal-desc" name="projectDescription" rows={3} value={formData.projectDescription} onChange={handleChange} className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold" placeholder="Tell us about your project..." />
              </div>
              <PhotoUpload idPrefix="modal" variant="light" compact onFilesChange={setPhotos} />
              {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}
              <button type="submit" disabled={status === "loading"} className="w-full rounded-full bg-gold py-3 font-semibold text-deep-black transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60">
                {status === "loading" ? "Sending..." : "Request My Free Consultation"}
              </button>
              <p className="text-center text-sm text-gray-500">We respond to every inquiry within 24 hours.</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
