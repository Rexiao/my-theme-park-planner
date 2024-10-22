import getEnv from './getenv';

export function isUserAdmin(email: string | undefined): boolean {
  const adminEmail = getEnv('ADMIN_EMAIL');
  return email === adminEmail;
}
