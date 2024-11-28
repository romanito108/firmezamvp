"use client";

import './globals.css';
import Header from './components/header';
import Footer from './components/footer';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Firmeza Token</title> 
        <meta name="description" content="Firmeza Token" />
        <link rel="icon" href="/favicon.jpeg" /> 
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head >

      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <Header setWalletResponse={() => { }} />
        
        {/* Main content area that will grow to take available space */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer always at the bottom */}
        <Footer />

        <Script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    strategy="beforeInteractive"
  />
 
      </body>
    </html>
  );
}