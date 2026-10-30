import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'दुर्गा एसोसिएट्स एंड प्रॉपर्टी डीलर, अजमेर | प्रॉपर्टी रजिस्ट्रेशन, बैनामा व कानूनी विलेख विशेषज्ञ',
  description: 'अजमेर में अचल संपत्ति रजिस्ट्री, बैनामा (Sale Deed), दान पत्र (Gift Deed), हकत्याग पत्र, लीज एग्रीमेंट, ई-पंजीयन स्टाम्प ड्यूटी गणना एवं ई-ग्रास चालान हेतु अधिकृत विशेषज्ञ। फोन: 9829261354, 8003987152।',
  keywords: 'Durga Associates Ajmer, Durga Property Dealer Ajmer, Property Registration Ajmer, Stamp Duty Calculator Rajasthan, DLC Rate Ajmer, Bainama Ajmer, Sub Registrar Ajmer Collectorate, Sale Deed Ajmer',
  authors: [{ name: 'Durga Associates & Property Dealer, Ajmer' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
