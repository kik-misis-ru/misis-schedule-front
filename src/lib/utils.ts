//

import {ITeacherInfo} from "./ApiHelper";

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Добавление незначащих нулей слева
 *
 * @param {string} s
 * @param {number} len
 * return {string}
 */
export const padZeros = (s: string, len: number) => s.padStart(len, '0');

