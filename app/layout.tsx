import './globals.css';
import type { Metadata } from 'next';
import { ReactQueryClientProvider } from '@/components/react-query-client-provider';

export const metadata: Metadata = {
  title: 'Guardian Ops AI',
  description:
    'Agentic automation that triages and resolves Safe Guardian requests in real time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full bg-slate-950 text-slate-50">
      <body className="h-full">
        <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
      </body>
    </html>
  );
}
