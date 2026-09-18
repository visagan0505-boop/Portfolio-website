import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Visagan Gunaratnam | Senior Infrastructure Drafter & BIM Delivery Leader (MEngNZ-1160599)',
  description: '18+ years leading large-span structural steel, precast systems, and LOD400 BIM authoring across Australasia. Programme-level BIM governance, Revit, Dynamo (Python), and DfMA fabrication integration.',
  openGraph: {
    title: 'Visagan Gunaratnam | Senior Infrastructure Drafter & BIM Delivery Leader',
    description: '18+ years leading large-span structural steel, precast systems, and LOD400 BIM authoring across Australasia.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visagan Gunaratnam | Senior Infrastructure Drafter & BIM Delivery Leader',
    description: '18+ years leading large-span structural steel, precast systems, and LOD400 BIM authoring across Australasia.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-zinc-950 text-neutral-100 antialiased selection:bg-[#C5A880]/30 selection:text-neutral-100" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
