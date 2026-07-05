"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

export function ContactForm({
  dict,
  email,
}: {
  dict: Dictionary;
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!FORM_ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: new FormData(event.currentTarget),
        headers: { Accept: "application/json" },
      });
      setStatus(response.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-terracotta";

  return (
    <div>
      {status === "ok" ? (
        <p className="rounded-xl bg-moss/20 p-4 font-semibold text-forest-dark">
          {dict.contact.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            required
            aria-label={dict.contact.name}
            placeholder={dict.contact.name}
            className={inputClasses}
          />
          <input
            name="email"
            type="email"
            required
            aria-label={dict.contact.email}
            placeholder={dict.contact.email}
            className={inputClasses}
          />
          <input
            name="glamping"
            required
            aria-label={dict.contact.glamping}
            placeholder={dict.contact.glamping}
            className={inputClasses}
          />
          <input
            name="website"
            aria-label={dict.contact.website}
            placeholder={dict.contact.website}
            className={inputClasses}
          />
          <textarea
            name="message"
            required
            rows={5}
            aria-label={dict.contact.message}
            placeholder={dict.contact.message}
            className={inputClasses}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-terracotta px-7 py-2.5 font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60"
          >
            {status === "sending" ? dict.contact.sending : dict.contact.send}
          </button>
          {status === "error" && (
            <p className="rounded-xl bg-terracotta/15 p-4 text-sm text-terracotta-dark">
              {dict.contact.error}
            </p>
          )}
        </form>
      )}
      <p className="mt-6 text-sm text-forest/70">
        {dict.contact.emailIntro}{" "}
        <a
          href={`mailto:${email}`}
          className="font-semibold text-terracotta underline"
        >
          {email}
        </a>
      </p>
    </div>
  );
}
