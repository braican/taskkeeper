// Mirrors the PocketBase SDK's own loose pb.authStore.isValid check (decode
// the JWT's exp claim, no signature verification) so every layer that gates
// routes agrees with the client about whether a session is still current.
export function isAuthCookieValid(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  try {
    const { token } = JSON.parse(cookieValue);
    const payload = token?.split('.')[1];
    if (!payload) {
      return false;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === 'number' && Date.now() / 1000 < exp;
  } catch {
    return false;
  }
}
