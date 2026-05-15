/** Common TLD bases — catches typos like gmail.comms (com + ms). Suffix capped at 5 chars. */
const TYPO_TLD_PATTERN =
  /^(com|org|net|edu|gov|mil|int|info|biz|in|io|co|uk|us|au|ca|de|fr|jp|cn|br|ru)([a-z]{1,5})$/;

const EMAIL_LOCAL_REGEX = /^[a-zA-Z0-9._%+-]+$/;
const EMAIL_DOMAIN_REGEX =
  /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isTypoTld(tld: string): boolean {
  const match = tld.match(TYPO_TLD_PATTERN);
  if (!match) return false;
  return tld !== match[1];
}

/**
 * Validates email structure: proper local@domain.tld, TLD ≥ 2 letters,
 * rejects incomplete domains (.c) and typo extensions (.comms).
 */
export function isValidEmail(value: string): boolean {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254) return false;

  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex >= email.length - 1) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (!local || local.length > 64 || !EMAIL_LOCAL_REGEX.test(local)) return false;
  if (!domain || !EMAIL_DOMAIN_REGEX.test(domain)) return false;

  const labels = domain.split(".");
  const tld = labels[labels.length - 1];

  if (!/^[a-z]{2,63}$/.test(tld)) return false;
  if (isTypoTld(tld)) return false;

  return labels.every((label) => label.length > 0 && label.length <= 63);
}
