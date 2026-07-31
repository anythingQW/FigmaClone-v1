import type { Metadata } from 'next';
import '../index.css';
export const metadata: Metadata = {
  title: 'Flavor — Vector Graphic Editor',
  description: 'Collaborative vector design platform.',
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
