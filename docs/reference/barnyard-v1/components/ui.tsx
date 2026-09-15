import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export function ExtGlyph() {
  return (
    <svg className="ext" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path d="M2.5 9.5 L9.5 2.5 M4.5 2.5 H9.5 V7.5" />
    </svg>
  );
}

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  quiet?: boolean;
  children: ReactNode;
}

/** Hairline-underlined text. External links get the stroked glyph, never an arrow. */
export function TextLink({ href, quiet, children, className, ...rest }: TextLinkProps) {
  const cls = `${quiet ? "link-quiet" : "link"}${className ? ` ${className}` : ""}`;
  const external = /^https?:\/\//.test(href);
  if (external) {
    // Keep the glyph on the same line as the last word so it never orphans.
    let head: ReactNode = children;
    let tail: ReactNode = null;
    if (typeof children === "string") {
      const i = children.lastIndexOf(" ");
      if (i > 0) {
        head = children.slice(0, i + 1);
        tail = children.slice(i + 1);
      } else {
        head = null;
        tail = children;
      }
    }
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {head}
        <span style={{ whiteSpace: "nowrap" }}>
          {tail}
          <ExtGlyph />
        </span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  primary?: boolean;
  children: ReactNode;
}

export function ButtonLink({ href, primary, children, className, ...rest }: ButtonLinkProps) {
  const cls = `btn${primary ? " btn-primary" : ""}${className ? ` ${className}` : ""}`;
  const external = /^https?:\/\//.test(href);
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export interface FactRow {
  term: string;
  value?: ReactNode | null | false;
}

/** A definition list. Rows with no value simply do not exist. */
export function FactFile({ rows, className }: { rows: FactRow[]; className?: string }) {
  const items = rows.filter((r) => r.value !== undefined && r.value !== null && r.value !== false && r.value !== "");
  if (items.length === 0) return null;
  return (
    <dl className={`factfile${className ? ` ${className}` : ""}`}>
      {items.map((r) => (
        <div key={r.term}>
          <dt>{r.term}</dt>
          <dd className="num">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Rule({ strong, soft, className }: { strong?: boolean; soft?: boolean; className?: string }) {
  return <hr className={`rule${strong ? " rule-strong" : ""}${soft ? " rule-soft" : ""}${className ? ` ${className}` : ""}`} />;
}
