//

export const DAY_SUNDAY = "sunday";
export const DAY_NOT_SUNDAY = "notSunday";

//

export type LESSON_EXIST = 'empty'
  | 'inSchedule'
  | 'notInSchedule'
  | 'endLessons'
  | typeof DAY_SUNDAY;

//

export const DAY_TODAY = 'today';
export const DAY_TOMORROW = 'tomorrow';
export type TodayOrTomorrow = 'today' | 'tomorrow'

//

export type StartOrEnd = 'start' | 'end'

//

export const THIS_WEEK = 0;
export const OTHER_WEEK = 1;
export type THIS_OR_OTHER_WEEK = typeof THIS_WEEK | typeof OTHER_WEEK;

//
export const CHAR_SBER = 'sber'; // Сбер
export const CHAR_EVA = 'eva';   // Афина
export const CHAR_JOY = 'joy';   // Джой
export type CharacterId = typeof CHAR_SBER
  | typeof CHAR_EVA
  | typeof CHAR_JOY

//

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'
export type ThemeType = THEME_DARK | THEME_LIGHT

//

export interface IDayHeader {
  title: string
  date: string
  count: number
}


export interface IBuilding {
  name: string
  address: string
  color: string
  short: string
}

