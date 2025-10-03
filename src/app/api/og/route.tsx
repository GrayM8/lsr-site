import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const v = searchParams.get("v") // Cache-busting param

  // Fonts
  const bebasNeueBold = await fetch(
    new URL("../../../../assets/BebasNeue-Bold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer())
  const inter = await fetch(
    new URL("../../../../assets/Inter-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer())

  // Background Image
  const baseUrl = req.nextUrl.origin
  const bgImage = `${baseUrl}/images/lsr-hero3.jpg`

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          position: "relative",
          fontFamily: '"Inter", sans-serif',
        }}
      >
        {/* Background Layers - Order determines stacking */}
        <img
          src={bgImage}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            objectFit: "cover",
            filter: "blur(3px) opacity(0.8)",
            transform: "scale(1.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(900px circle at 50% 35%, transparent, rgba(0,0,0,0.15))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(38, 38, 38, 0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(to bottom, rgba(38, 38, 38, 0.5), transparent, rgba(38, 38, 38, 0.6))",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.01,
            mixBlendMode: "overlay",
            backgroundImage:
              "repeating-linear-gradient(135deg, white 0px, white 1px, transparent 1px, transparent 11px)",
          }}
        />

        {/* Foreground Content - Renders on top */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 100px",
          }}
        >
          <h1
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: "100px",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "0.025em", // Corrected letter spacing
              color: "#bf5700",
              textShadow: "0 6px 24px rgba(191, 87, 0, 0.45)",
              margin: 0,
              // @ts-expect-error - webkit-text-stroke is not in the type definitions
              "-webkit-text-stroke": "1px rgba(0,0,0,0.2)",
            }}
          >
            LONGHORN SIM RACING
          </h1>
          <p
            style={{
              fontSize: "24px", // Final size reduction
              color: "rgba(255, 255, 255, 0.85)",
              marginTop: "24px",
            }}
          >
            Bringing motorsports closer to Longhorns and Longhorns closer to the
            podium.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Bebas Neue", data: bebasNeueBold, style: "normal", weight: 700 },
        { name: "Inter", data: inter, style: "normal", weight: 400 },
      ],
      headers: {
        "Cache-Control": "s-maxage=604800, stale-while-revalidate", // 7 days
      },
    }
  )
}
