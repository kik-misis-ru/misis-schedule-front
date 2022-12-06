import * as moment from 'moment';
import DayOfWeek from "../language-ru/DayOfWeek";

import { padZeros } from '../language-ru/utils';
import number from "../language-ru/Number";

// Init `momentjs` module
moment.locale('ru');

/**
 * сколько миллисекунд в 1 дне
 */
export const MS_IN_DAY = 24 * 60 * 60 * 1000;

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
 * получить дату первого дня недели
 * в виде строки
 *
 * @param date
 */
export function getFirstDayWeek(date: Date): string {
  console.log('getFirstDayWeek:', date)
  // номер дня недели
  // const now = new Date();
  // this.setState({ today: now.getDay() });

  const weekDay = date.getDay()
  let dayDiff: number;

  if (weekDay === 0) { // Воскресенье
    dayDiff = -(weekDay + 6);

  } else if (weekDay === 1) { // Понедельник
    dayDiff = 0;

  } else { // Не воскресенье и не понедельник
    // число первого дня недели
    dayDiff = - (weekDay - 1);

  }
  const firstDay = date.getTime() + dayDiff * MS_IN_DAY;
  const result = formatDateWithDashes(new Date(firstDay))
  console.log('getFirstDayWeek: result:', result)
  return result;
}


// /**
//  *
//  * @param {string} adj
//  * @returns {string}
//  */
// export function lessonTypeAdjToNoun(adj: string): string {
//   let result;
//   switch (adj) {
//     case "Лекционные":
//       result = "Лекция";
//       break;
//     case "Практические":
//       result = "Практика";
//       break;
//     case "Лабораторные":
//       result = "Лаба";
//       break;
//     default:
//       break;
//   }
//   return result
// }

// /**
//  *
//  * @param {number} pairCount
//  * @return {string}
//  */
// export function pairNumberToPairNumText(pairCount: number): string {
//   switch (pairCount) {
//     case 1:
//       return "одна пара";
//     case 2:
//       return "две пары";
//     case 3:
//       return "три пары";
//     case 4:
//       return "четыре пары";
//     default:
//       return `${pairCount} пар`;
//   }
// }


// export function pairNumberToPairText(pairCount: number): string | undefined {
//   const lesson = (pairCount === 1)
//     ? "пара"
//     : (pairCount === 2 || pairCount === 3 || pairCount === 4)
//       ? "пары"
//       : "пар"
//   return lesson;
// }

/**
 * возвращает короткое название дня недели (Пн,Вт,...)
 * для заданной даты
 *
 * @param {Date} date
 * @returns string    - короткое название дня недели (Пн,Вт,...)
 */
export function getDayOfWeekShortForDate(date: Date): string {
  // Возвращает порядковый номер дня недели на заданную дату
  // 0 - воскресенье, 1 - понедельник
  const dayOfWeekIndexForDate = date.getDay();
  return DayOfWeek.short[dayOfWeekIndexForDate];
}

