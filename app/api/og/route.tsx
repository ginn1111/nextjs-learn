import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';

const handler = (request: NextRequest) => {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            backgroundColor: 'black',
            backgroundSize: '150px 150px',
            height: '100%',
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            padding: '65px',
          }}
        >
          <div
            style={{
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              color: 'white',
              marginTop: 30,
              padding: '0 100px',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              height: '75%',
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
            className="w-10 capitalize"
          >
            {'Ginn'}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '70px', height: '70px', display: 'flex' }}>
              <img
                src="https://media.graphassets.com/gncWvSEqRFaBSUPZGoTP"
                width={70}
                height={70}
                alt="devtomars blog"
              />
            </div>

            <div
              style={{
                backgroundClip: 'text',
                color: 'transparent',
                backgroundImage: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                fontWeight: 700,
                fontSize: 30,
              }}
            >
              DevToMars
            </div>
          </div>
        </div>
      ),
    );
  } catch (error) {
    return NextResponse.json('Failed to generate image', {
      status: 500,
    });
  }
};

export const config = {
  runtime: 'edge',
};
export { handler as GET };
