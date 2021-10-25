import * as moment from 'moment';
moment.locale('ru');


/**
 * сколько миллисекунд в 1 дне
 */
export const MS_IN_DAY = 24 * 60 * 60 * 1000;

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
 * Convert string DD?MM?YYYY to Date
 *
 * @param {string} s
 * @return {Date}
 */
export const ddMmYyyyToDate = (s: string): Date => {
  const d = parseInt(s.slice(0, 2));
  const m = parseInt(s.slice(3, 5))-1;
  const y = parseInt(s.slice(-4));
  return new Date(y, m, d);
}

/**
 * Convert string DD?MM?YY to Date
 *
 * @param {string} s
 * @return {Date}
 */
export const ddMmYyToDate = (s: string): Date => {
  const d = parseInt(s.slice(0, 2));
  const m = parseInt(s.slice(3, 5))-1;
  const y = 2000 + parseInt(s.slice(-2));
  return new Date(y, m, d);
}

/**
 * форматирование даты в "YYYY-MM-DD"
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatDateWithDashes(date: Date): string {
  const monthNum = date.getMonth() + 1;
  const dayNum = date.getDate();
  const y = date.getFullYear();

  //pad with zeroes
  // const m = (monthNum < 10 ? '0' : '') + monthNum;
  const m = padZeros(monthNum.toString(), 2);
  // const d = (dayNum < 10 ? '0' : '') + dayNum;
  const d = padZeros(dayNum.toString(), 2);

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
  // const m = (monthNum < 10 ? '0' : '') + monthNum;
  const m = padZeros(monthNum.toString(), 2);
  // const d = (dayNum < 10 ? '0' : '') + dayNum;
  const d = padZeros(dayNum.toString(), 2);

  return `${d}.${m}.${y}`;
}

/**
 * получить текущее время в формате "HH:MM"
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatTimeHhMm(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return `${(hours < 10 ? '0' : '').concat('' + hours)}:${(minutes < 10 ? '0' : '').concat('' + minutes)}`
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

