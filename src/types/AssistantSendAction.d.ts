import {
  DAY_SUNDAY,
  DAY_NOT_SUNDAY,
  DAY_TODAY,
  DAY_TOMORROW,
  LESSON_EXIST, TodayOrTomorrow,
} from './base.d'

//

export interface AssistantSendActionTodaySchedule {
  action_id: 'todaySchedule'
  parameters: {
    day: typeof DAY_SUNDAY
      | typeof DAY_NOT_SUNDAY
  }
}

export interface AssistantSendActionTomorrowSchedule {
  action_id: 'tomorrowSchedule'
  parameters: {
    day: typeof DAY_SUNDAY
      | typeof DAY_NOT_SUNDAY
  }
}

export interface AssistantSendActionSay {
  action_id: 'say'
  parameters: {
    type: string,
    day: string,
    ordinal?: string,
    time?: string | [string, string]
  }
}

export interface AssistantSendActionSay1 {
  action_id: 'say1'
  parameters: {
    day: typeof DAY_SUNDAY|undefined,
  } | {
    day: TodayOrTomorrow,
    lesson?: string,
    dayName?: string,
    amount?: string,
  }
}

export interface AssistantSendActionSay2 {
  action_id: 'say2'
  parameters: {
    day?: typeof DAY_SUNDAY
  } | {
    amount?: string
    pron?: string
  }
}

export interface AssistantSendActionSay3 {
  action_id: 'say3'
  parameters: {
    audience?: string
    type?: 'current' | 'nearest' | 'next'
    exist?: LESSON_EXIST
  }
}

export interface AssistantSendActionSay4 {
  action_id: 'say4'
  parameters: {
    lesson: string | undefined,
    type: string,
    num: number | undefined,
  }
}

export interface AssistantSendActionSay5 {
  action_id: 'say5'
  parameters: {
    day1: typeof DAY_SUNDAY
  } | {
    num: string
    day: udefined | typeof DAY_TODAY
      | typeof DAY_TOMORROW,
    dayName: string,
  }
}

export interface AssistantSendActionSay6 {
  action_id: 'say6'
  parameters: {
    dayName: string,
  }
}

export interface AssistantSendSettings{
  action_id: 'settings'
}

export interface AssistantSendChangeGroup{
  action_id: 'change_group'
  parameters: {
    IsStudent: boolean
  }
}

export type AssistantSendAction = AssistantSendActionTodaySchedule
  | AssistantSendActionTomorrowSchedule
  | AssistantSendActionSay
  | AssistantSendSettings
  | AssistantSendActionSay1
  | AssistantSendActionSay2
  | AssistantSendActionSay3
  | AssistantSendActionSay4
  | AssistantSendActionSay5
  | AssistantSendActionSay6
  |AssistantSendChangeGroup


//
