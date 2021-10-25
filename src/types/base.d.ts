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
export const CHAR_SBER = 'sber';
export const CHAR_EVA = 'eva';
export const CHAR_JOY = 'joy';
export const CHAR_TIMEPARAMOY = 'timeParamoy';
export type Character = typeof CHAR_SBER
  | typeof CHAR_EVA
  | typeof CHAR_JOY

//

export interface IDayHeader {
  title: string
  date: [string, string]
  count: [number, number]
}


export interface IBuilding {
  name: string
  address: string
  color: string
  short: string
}

