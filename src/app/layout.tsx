import type { Metadata } from 'next';
import { Funnel_Sans, Funnel_Display } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/sidebar';
import styles from './layout.module.css';
import './globals.css';

const funnelSans = Funnel_Sans({
  variable: '--font-primary',
  subsets: ['latin'],
});

const funnelDisplay = Funnel_Display({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Taskkeeper',
  description: "Know how much you're owed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${funnelSans.variable} ${funnelDisplay.variable}`}
    >
      <body>
        <AuthProvider>
          <div className={styles.mainLayout}>
            <aside className={styles.aside}>
              <Sidebar />
            </aside>
            <main className={styles.main}>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
