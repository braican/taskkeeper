import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isAuthCookieValid } from '@/lib/auth';
import ProtectedGuard from '@/components/protected-guard';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  if (!isAuthCookieValid(cookieStore.get('pb_auth')?.value)) {
    redirect('/');
  }

  return <ProtectedGuard>{children}</ProtectedGuard>;
}
