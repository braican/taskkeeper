import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import Sidebar from '@/components/sidebar';
import './globals.css';

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
    <html lang="en">
      <body>
        <AuthProvider>
          <Sidebar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
