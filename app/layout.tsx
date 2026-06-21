import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Mithila Express | Food Delivery in Mahottari, Nepal',
  description: 'Mithila Express connects Customers, Local Restaurants, and Delivery Partners in Mahottari District, Nepal.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased min-h-screen bg-slate-50 text-slate-900 selection:bg-orange-500/10 selection:text-orange-600">
        {children}
      </body>
    </html>
  );
}
