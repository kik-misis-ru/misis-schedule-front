/**
 * сколько миллисекунд в 1 дне
 */
export const MS_IN_DAY = 24 * 60 * 60 * 1000;


/**
 * форматирование даты в "YYYY-MM-DD"
 *
 * @param date Date
 * @returns string
 */
export function formatDateWithDashes(date: Date): string {
  const monthNum = date.getMonth() + 1;
  const dayNum = date.getDate();
  const y = date.getFullYear();

  //pad with zeroes
  const m = (monthNum < 10 ? '0' : '') + monthNum;
  const d = (dayNum < 10 ? '0' : '') + dayNum;

  return `${y}-${m}-${d}`;
}

/**
 * форматирование даты в вид "DD.MM.YY"
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatDateWithDots(date: Date): string {
  const monthNum = date.getMonth() + 1;
  const dayNum = date.getDate();
  const y = String(date.getFullYear()).slice(2, 4)

  //pad with zeroes
  const m = (monthNum < 10 ? '0' : '') + monthNum;
  const d = (dayNum < 10 ? '0' : '') + dayNum;

  return `${d}.${m}.${y}`;
}

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


export function getFullGroupName(group: string, subGroup: string): string {
  return (subGroup !== "")
    ? `${group} (${subGroup})`
    : `${group} `
}


export const getIsCorrectTeacher = ({
                               isStudent,
                               isTeacherCorrect,
                             }: {
  isStudent: boolean
  isTeacherCorrect: boolean
}) => {
  return !isStudent && isTeacherCorrect
}

