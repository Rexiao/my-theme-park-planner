export function isUserAdmin(email: string | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return email === adminEmail;
}
