"use client";

import { useState } from "react";

/**
 * Accessible inquiry form.
 *
 * Submitting composes an addressed, structured message to the relevant desk in
 * the reader's own mail client. That is the mechanism, and it works: the
 * message reaches a monitored address and nothing is dropped in transit.
 *
 * ── On the note beneath the button ───────────────────────────────────────────
 *
 * It used to read "No submission backend yet". That sentence described the
 * repository's implementation status rather than telling the reader anything
 * they needed, and to a buyer weighing a paid engagement it read as
 * provisional — which is a strange thing for a site to volunteer about its own
 * commercial front door. The note now states what the button does. If the
 * mechanism changes, the note changes with it.
 *
 * `note` overrides the default where a caller needs to say something more
 * specific about where the message lands.
 */
export default function InquiryForm({
  id,
  recipient,
  subjectPrefix,
  submitLabel = "Compose message",
  messageLabel = "Message",
  messagePlaceholder,
  note,
}: {
  id: string;
  recipient: string;
  subjectPrefix: string;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  /** Replaces the default line beneath the submit button. */
  note?: string;
}) {
  const [name, setName] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `${subjectPrefix}${name ? ` — ${name}` : ""}`;
    const body = [
      name && `Name: ${name}`,
      organisation && `Organisation: ${organisation}`,
      email && `Email: ${email}`,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="rounded-xl border p-6 space-y-4"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field id={`${id}-name`} label="Name" value={name} onChange={setName} required />
        <Field
          id={`${id}-organisation`}
          label="Organisation"
          value={organisation}
          onChange={setOrganisation}
        />
      </div>
      <Field id={`${id}-email`} label="Email" type="email" value={email} onChange={setEmail} required />
      <div>
        <label
          htmlFor={`${id}-message`}
          className="block text-xs font-medium mb-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {messageLabel}
        </label>
        <textarea
          id={`${id}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          required
          placeholder={messagePlaceholder}
          className="w-full rounded-lg border px-3 py-2 text-sm"
          style={{
            backgroundColor: "var(--bg-base)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="btn-primary inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold"
        >
          {submitLabel}
        </button>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {note ?? `Opens an addressed message to ${recipient}.`}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-medium mb-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-sm"
        style={{
          backgroundColor: "var(--bg-base)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}
