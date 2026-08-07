import { siteConfig } from "@/lib/site";
import { ImageResponse } from "next/og";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const palette = {
  ground: "#0B1E26",
  ink: "#EEF5F4",
  muted: "#7C9DA5",
  accent: "#56C4C0",
  rule: "#1B3B45",
};

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: palette.ground,
          color: palette.ink,
        }}
      >
        {/* Record spine - the one structural device */}
        <div style={{ display: "flex", width: 14, background: palette.accent }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "78px 84px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.22em",
              color: palette.accent,
              textTransform: "uppercase",
            }}
          >
            {siteConfig.role}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 108,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              marginTop: 26,
            }}
          >
            {siteConfig.author}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 34,
              lineHeight: 1.35,
              color: palette.muted,
              marginTop: 28,
              maxWidth: 840,
            }}
          >
            {siteConfig.tagline}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 40,
              fontSize: 25,
              color: palette.ink,
            }}
          >
            {siteConfig.highlights.map((item, index) => (
              <div key={item} style={{ display: "flex", alignItems: "center" }}>
                {index > 0 && (
                  <div
                    style={{
                      display: "flex",
                      width: 6,
                      height: 6,
                      margin: "0 22px",
                      background: palette.accent,
                    }}
                  />
                )}
                <div style={{ display: "flex", whiteSpace: "nowrap" }}>{item}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "auto",
              paddingTop: 46,
            }}
          >
            <div style={{ display: "flex", height: 1, background: palette.rule }} />
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 24,
                letterSpacing: "0.04em",
                color: palette.muted,
              }}
            >
              {siteConfig.domain}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
