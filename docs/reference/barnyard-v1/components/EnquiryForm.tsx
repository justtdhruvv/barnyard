"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

export interface EnquiryField {
  name: string;
  label: string;
  /** "contact" takes a phone number or an email address */
  type?: "text" | "email" | "tel" | "contact" | "date" | "time" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  span?: boolean;
}

interface EnquiryFormProps {
  subject: string;
  fields: EnquiryField[];
  /** when set, the form composes an email; otherwise a WhatsApp message */
  email?: string;
  whatsapp: string;
}

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function EnquiryForm({ subject, fields, email, whatsapp }: EnquiryFormProps) {
  const id = useId();
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState<string | undefined>(undefined);

  // Set after mount so the server and the first client render agree.
  useEffect(() => setToday(isoToday()), []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = fields
      .map((f) => {
        const v = String(data.get(f.name) ?? "").trim();
        return v ? `${f.label}: ${v}` : null;
      })
      .filter(Boolean);
    const body = [subject, "", ...lines].join("\n");
    const href = email
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      : `${whatsapp}?text=${encodeURIComponent(body)}`;
    window.open(href, email ? "_self" : "_blank", "noopener");
    setSent(href);
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {fields.map((f) => {
        const fid = `${id}-${f.name}`;
        const autoComplete =
          f.type === "email" ? "email" : f.type === "tel" || f.type === "contact" ? "tel" : f.name === "name" ? "name" : undefined;
        return (
          <div key={f.name} className={`field${f.span || f.type === "textarea" ? " span-2" : ""}`}>
            <label htmlFor={fid}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={fid} name={f.name} rows={3} required={f.required} />
            ) : f.type === "select" ? (
              <select id={fid} name={f.name} required={f.required} defaultValue="">
                <option value="" disabled>
                  Choose
                </option>
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={fid}
                name={f.name}
                type={f.type === "contact" ? "text" : (f.type ?? "text")}
                required={f.required}
                autoComplete={autoComplete}
                min={f.type === "date" ? today : undefined}
              />
            )}
          </div>
        );
      })}
      <div className="span-2 stack" style={{ "--stack": "0.6rem" } as React.CSSProperties}>
        <button type="submit" className="btn btn-primary">
          {email ? "Send enquiry" : "Send on WhatsApp"}
        </button>
        <p className="t-caption" aria-live="polite">
          {sent ? (
            <>
              {email ? "Your mail app should open with the message." : "WhatsApp should open with the message."} If it did not,{" "}
              <a className="link" href={sent} target={email ? undefined : "_blank"} rel="noopener noreferrer">
                open it here
              </a>
              .
            </>
          ) : email ? (
            "Composes an email in your mail app. Nothing is stored here."
          ) : (
            "Composes a WhatsApp message to the cafe. Nothing is stored here."
          )}
        </p>
      </div>
    </form>
  );
}
