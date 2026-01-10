import { ImageResponse } from 'next/og';
import fs from 'fs/promises';
import path from 'path';

// Using Node.js runtime to access filesystem
// export const runtime = 'edge'; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params with defaults matching the Hero section
    const title = searchParams.get('title') || 'LONGHORN SIM RACING';
    const subtitle = searchParams.get('subtitle') || 'UNIVERSITY OF TEXAS AT AUSTIN';

    // 1. Fonts - ENABLED
    const fontKanitBlackItalic = await fetch(
      'https://raw.githubusercontent.com/google/fonts/main/ofl/kanit/Kanit-BlackItalic.ttf'
    ).then((res) => {
        if (!res.ok) throw new Error('Failed to load Kanit font');
        return res.arrayBuffer();
    });

    const fontMontserratBold = await fetch(
       'https://cdn.jsdelivr.net/npm/@fontsource/montserrat@5.0.13/files/montserrat-latin-700-normal.woff'
    ).then((res) => {
        if (!res.ok) throw new Error('Failed to load Montserrat font');
        return res.arrayBuffer();
    });

    // 2. Background Image - RESTORED (Using Hero JPG)
    const heroImgPath = path.join(process.cwd(), 'public', 'images', 'lsr-hero3.JPG');
    const heroImgBuffer = await fs.readFile(heroImgPath);
    const heroImgBase64 = `data:image/jpeg;base64,${heroImgBuffer.toString('base64')}`;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1B1B1B', // lsr-charcoal
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 1. Base Image */}
          <img
            src={heroImgBase64}
            alt="Background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.5,
            }}
          />

          {/* 2. Overlay (Solid color with opacity) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(27, 27, 27, 0.4)', // lsr-charcoal / 40
            }}
          />

          {/* --- CONTENT LAYER --- */}
          <div
             style={{
                 position: 'relative',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 padding: '40px',
                 textAlign: 'center',
             }}
          >
              {/* Badge */}
              <div
                  style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255, 128, 0, 0.3)', // lsr-orange/30
                      backgroundColor: 'rgba(255, 128, 0, 0.1)', // lsr-orange/10
                      padding: '8px 24px',
                      marginBottom: '40px',
                  }}
              >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF8000' }} />
                  <span
                      style={{
                          color: '#FF8000',
                          fontFamily: 'Montserrat', 
                          fontSize: '14px',
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                      }}
                  >
                      ESTABLISHED 2025 · UT AUSTIN
                  </span>
              </div>

              {/* Main Title Container with Glow */}
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Glow Effect */}
                  <div
                      style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: '600px',
                          height: '300px',
                          backgroundColor: 'rgba(255, 128, 0, 0.2)',
                          filter: 'blur(60px)',
                          zIndex: -1,
                          opacity: 0.6,
                          marginLeft: '-300px',
                          marginTop: '-150px',
                      }}
                  />

                  {/* Title Text */}
                  <div
                      style={{
                          fontSize: 90, // Large Hero size
                          fontFamily: 'Kanit',
                          fontWeight: 900,
                          fontStyle: 'italic',
                          color: 'white',
                          textTransform: 'uppercase',
                          lineHeight: 0.85,
                          textShadow: '0 0 40px rgba(255,255,255,0.3)',
                          textAlign: 'center',
                      }}
                  >
                      {title}
                  </div>

                  {/* Subtitle Text */}
                  <div
                      style={{
                          marginTop: '30px',
                          fontFamily: 'Montserrat',
                          fontSize: '24px',
                          fontWeight: 700,
                          color: 'rgba(255, 255, 255, 0.5)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.6em',
                          lineHeight: 1,
                          textAlign: 'center',
                      }}
                  >
                      {subtitle}
                  </div>
              </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Kanit',
            data: fontKanitBlackItalic,
            style: 'italic',
            weight: 900,
          },
          {
             name: 'Montserrat',
             data: fontMontserratBold,
             weight: 700,
          }
        ],
      },
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
