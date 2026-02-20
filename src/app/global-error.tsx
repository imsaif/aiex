'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: 'white', color: 'black' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'gray', marginBottom: '24px' }}>
              An unexpected error occurred. Please try again.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: '10px 20px',
                  border: '1px solid lightgray',
                  borderRadius: '8px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'black',
                  fontSize: '14px',
                }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
