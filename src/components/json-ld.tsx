import type { Graph, Thing, WithContext } from "schema-dts";

type Props = {
  data: WithContext<Thing> | Graph;
};

// Escape `<` so a value can never close the script tag early.
export const JsonLd = ({ data }: Props) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
);
