import { cafe, enquiryEmail, phoneHref, whatsappHref } from "@/lib/cafe";
import { EnquiryForm, type EnquiryField } from "@/components/EnquiryForm";
import { TextLink } from "@/components/ui";

export type RequestKind = "host" | "shoot" | "bowl";

const POLICY: Record<RequestKind, string> = {
  host: "Tell us the occasion and the date, and the house replies on WhatsApp. Nothing is stored here.",
  shoot: "Send the usage, the dates and the crew size, and the house confirms availability on WhatsApp. Nothing is stored here.",
  bowl: "Tell us when you would like to come and how many of you there are. Nothing is stored here.",
};

const SUBJECT: Record<RequestKind, string> = {
  host: "Hosting enquiry, The Barnyard Co.",
  shoot: "Shoot enquiry, The Barnyard Co.",
  bowl: "Lane request, The Alley at The Barnyard Co.",
};

const FIELDS: Record<RequestKind, EnquiryField[]> = {
  host: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "occasion", label: "The occasion", type: "select", options: ["Birthday", "Ceremony", "Corporate", "Brand launch", "Private dinner", "Something else"], required: true },
    { name: "date", label: "The date", type: "date", required: true },
    { name: "guests", label: "How many people", type: "number" },
    { name: "notes", label: "Anything else", type: "textarea" },
  ],
  shoot: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "usage", label: "Usage", type: "select", options: ["Photo", "Film", "Brand film", "Social", "Editorial"], required: true },
    { name: "dates", label: "Dates", required: true },
    { name: "crew", label: "Crew size", type: "number" },
    { name: "production", label: "Production or brand" },
    { name: "notes", label: "Setup, strike, night work, anything else", type: "textarea" },
  ],
  bowl: [
    { name: "name", label: "Your name", required: true },
    { name: "contact", label: "Phone or email", type: "contact", required: true },
    { name: "date", label: "The date", type: "date", required: true },
    { name: "time", label: "Around what time", type: "time" },
    { name: "players", label: "How many players", type: "number" },
    { name: "notes", label: "Anything else", type: "textarea" },
  ],
};

const HEADING: Record<RequestKind, string> = {
  host: "Ask about hosting.",
  shoot: "Ask about a shoot.",
  bowl: "Ask about a lane.",
};

/** What we need first, then a short form. One primary action; calling and WhatsApp stay as plain links beside it. */
export function RequestForm({ kind }: { kind: RequestKind }) {
  return (
    <section className="request grid" aria-labelledby={`request-${kind}`}>
      <div className="col-side stack" style={{ "--stack": "1rem" } as React.CSSProperties}>
        <h2 id={`request-${kind}`} className="t-headline">
          {HEADING[kind]}
        </h2>
        <p className="t-body">{POLICY[kind]}</p>
        <p className="t-ui num links-row">
          <a className="link" href={phoneHref}>
            Call {cafe.meta.phoneDisplay}
          </a>
          <TextLink href={whatsappHref}>WhatsApp</TextLink>
        </p>
      </div>
      <div className="col-main">
        <EnquiryForm subject={SUBJECT[kind]} fields={FIELDS[kind]} email={enquiryEmail} whatsapp={whatsappHref} />
      </div>
    </section>
  );
}
