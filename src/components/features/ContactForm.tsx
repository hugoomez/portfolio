"use client";

import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config";

const fieldClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Public entry point: pick the real form or the mailto fallback. */
export function ContactForm() {
  return siteConfig.formspreeId ? <FormspreeForm /> : <MailtoForm />;
}

function FormspreeForm() {
  const t = useTranslations("Contact");
  const [state, handleSubmit] = useForm(siteConfig.formspreeId);

  if (state.succeeded) {
    return (
      <p className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
        <CheckCircle2 className="h-5 w-5 text-accent" />
        {t("success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Honeypot field — hidden from real users, catches naive bots. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      <Field id="name" label={t("name")} placeholder={t("namePlaceholder")} />
      <div>
        <Field
          id="email"
          type="email"
          label={t("email")}
          placeholder={t("emailPlaceholder")}
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="mt-1 text-xs text-red-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={t("messagePlaceholder")}
          className={fieldClass}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1 text-xs text-red-500"
        />
      </div>

      {state.errors && (
        <p className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={state.submitting}
        className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}
      >
        {state.submitting ? t("sending") : t("send")}
      </button>
    </form>
  );
}

/** No Formspree id configured yet: a validated form that opens the mail client. */
function MailtoForm() {
  const t = useTranslations("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field
        id="name"
        label={t("name")}
        placeholder={t("namePlaceholder")}
        value={name}
        onChange={setName}
      />
      <Field
        id="email"
        type="email"
        label={t("email")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={setEmail}
      />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("messagePlaceholder")}
          className={fieldClass}
        />
      </div>
      <button
        type="submit"
        className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}
      >
        {t("send")}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={fieldClass}
      />
    </div>
  );
}
