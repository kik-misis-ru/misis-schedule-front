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

export const CHAR_SBER = 'sber';
export const CHAR_EVA = 'eva';
export const CHAR_JOY = 'joy';
export const CHAR_TIMEPARAMOY = 'timeParamoy';
export type Character = typeof CHAR_SBER
  | typeof CHAR_EVA
  | typeof CHAR_JOY

//
