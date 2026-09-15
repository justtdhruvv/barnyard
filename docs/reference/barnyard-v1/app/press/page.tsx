import type { Metadata } from "next";
import { cafe, fact, phoneHref, whatsappHref } from "@/lib/cafe";
import { Figure } from "@/components/Figure";
import { PressWall } from "@/components/PressWall";
import { ButtonLink, FactFile, TextLink } from "@/components/ui";

const { meta, design, press } = cafe;

export const metadata: Metadata = {
  title: "Press: a cafe in Ahmedabad written about by AD India, CNT India and ELLE Decor India",
  description: `Every feature on ${meta.name}, dated and linked: Architectural Digest India, Condé Nast Traveller India, ELLE Decor India, The Architect's Diary and Knocksense. Project credits for anyone writing about the building.`,
  alternates: { canonical: "/press" },
};

export default function Press() {
  const magazines = press.filter((p) => p.tier === 1).map((p) => p.publication);
  const others = press.filter((p) => p.tier !== 1).map((p) => p.publication);
  return (
    <>
      {/* Arrival */}
      <section className="wrap section-tight product-hero" aria-labelledby="press-title">
        <div className="stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
          <h1 id="press-title" className="t-display">
            Three magazines, one house.
          </h1>
          <p className="t-lede">
            {magazines.slice(0, -1).join(", ")} and {magazines[magazines.length - 1]} have each written about the
            house; so have {others.join(" and ")}. Every piece is below, dated and linked. The building was designed by{" "}
            {design.architect} of {design.studio} and photographed by {design.photographer}.
          </p>
        </div>
        <Figure id="press-hero" priority sizes="(min-width: 64rem) 50vw, 100vw" caption="The main floor and the stair to the mezzanine." />
      </section>

      {/* The wall */}
      <section className="wrap section-tight" aria-labelledby="features-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="features-title" className="t-headline">
              In their words.
            </h2>
          </div>
          <div className="col-main">
            <PressWall />
          </div>
        </div>
      </section>

      {/* The project */}
      <section className="wrap section-tight" aria-labelledby="project-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="project-title" className="t-headline">
              Credits, for anyone writing about it.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.5rem" } as React.CSSProperties}>
            <FactFile
              rows={[
                { term: "Architect", value: design.architect },
                {
                  term: "Studio",
                  value: (
                    <TextLink quiet href={design.studioInstagram}>
                      {design.studio}
                    </TextLink>
                  ),
                },
                { term: "Design team", value: design.designTeam.join(", ") },
                {
                  term: "Photographer",
                  value: (
                    <TextLink quiet href={design.photographerInstagram}>
                      {design.photographer}
                    </TextLink>
                  ),
                },
                { term: "Lighting", value: fact(design.lightingDesigner) },
                { term: "Structural engineers", value: fact(design.structuralEngineers) },
                { term: "Area", value: `${meta.sizeSqFt.toLocaleString("en-IN")} sq ft` },
                { term: "Completed", value: String(meta.yearBuilt) },
                { term: "Build", value: meta.buildDurationYears === 1 ? "One year" : `${meta.buildDurationYears} years` },
                { term: "Cost", value: meta.buildCostDisplay },
              ]}
            />
            <p className="t-ui">
              <TextLink href="/shoot">Shoot at the house</TextLink>
            </p>
          </div>
        </div>
      </section>

      {/* For press and media */}
      <section className="wrap section-tight" aria-labelledby="media-title">
        <div className="grid">
          <div className="col-side">
            <h2 id="media-title" className="t-headline">
              Come and see it.
            </h2>
          </div>
          <div className="col-main stack" style={{ "--stack": "1.25rem" } as React.CSSProperties}>
            <p className="t-body">To request images or arrange a visit, call or WhatsApp.</p>
            <div className="enquiry-actions">
              <ButtonLink href={phoneHref} primary>
                Call {meta.phoneDisplay}
              </ButtonLink>
              <ButtonLink href={whatsappHref}>WhatsApp</ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
