//

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


/**
 *
 * @param {string} adj
 * @returns {string}
 */
export function lessonTypeAdjToNoun(adj: string): string {
  let result;
  switch (adj) {
    case "Лекционные":
      result = "Лекция";
      break;
    case "Практические":
      result = "Практика";
      break;
    case "Лабораторные":
      result = "Лаба";
      break;
    default:
      break;
  }
  return result
}

/**
 *
 * @param {number} pairCount
 * @return {string}
 */
export function pairNumberToPairNumText(pairCount: number): string {
  switch (pairCount) {
    case 1:
      return "одна пара";
    case 2:
      return "две пары";
    case 3:
      return "три пары";
    case 4:
      return "четыре пары";
    default:
      return `${pairCount} пар`;
  }
}


export function pairNumberToPairText(pairCount: number): string | undefined {
  const lesson = (pairCount === 1)
    ? "пара"
    : (pairCount === 2 || pairCount === 3 || pairCount === 4)
      ? "пары"
      : "пар"
  return lesson;
}


