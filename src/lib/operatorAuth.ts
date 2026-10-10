import { timingSafeEqual } from 'crypto';

/**
 * Checks a presented operator password against OPERATOR_PASSWORD.
 *
 * Fails closed: with the variable unset or empty, nothing matches. There is no
 * built-in fallback, because any default would sit in the source for anyone to
 * read and would quietly open the portal on a deploy that forgot to set it.
 */
export function operatorPasswordMatches(presented: string) {
  const expected = process.env.OPERATOR_PASSWORD;
  if (!expected || !presented) return false;
  const left = Buffer.from(presented);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
