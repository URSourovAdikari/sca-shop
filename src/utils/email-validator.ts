export const ALLOWED_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
];

/**
 * Checks if an email address belongs to one of the trusted email providers.
 * @param email The email address to check
 * @returns true if the email is from an allowed provider, false otherwise
 */
export function isAllowedEmail(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  
  const domain = email.split("@")[1].toLowerCase().trim();
  
  // Direct match check against our allow-list
  return ALLOWED_EMAIL_DOMAINS.some(allowed => 
    domain === allowed || domain.endsWith(`.${allowed}`)
  );
}
