import { Label } from "./label";

const namespace = { full: 'player', short: 'plyr' };

/**
 * Creates a new label
 * @param label Label/tag name
 */
export function newLabel (label: string) {
  return Label(`${namespace.full}.${label}`)('@s');
}