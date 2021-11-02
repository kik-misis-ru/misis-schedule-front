import {
  TodayOrTomorrow,
  StartOrEnd,
} from './base.d'

//

interface AssistantEventCharacter {
  type: 'character'
  character: {
    id: Character
      | typeof CHAR_TIMEPARAMOY
  }
}

//

interface AssistantActionProfile {
  type: 'profile'
}

interface AssistantActionForToday {
  type: 'for_today'
}

interface AssistantActionForTomorrow {
  type: 'for_tomorrow'
}

interface AssistantActionForNextWeek {
  type: 'for_next_week'
}

interface AssistantActionForThisWeek {
  type: 'for_this_week'
}

interface AssistantActionWhenLesson {
  type: 'when_lesson'
  note: [
    StartOrEnd,
    TodayOrTomorrow,
    string,
  ]
}

interface AssistantActionHowMany {
  type: 'how_many'
  note: {
    timestamp: string
    dayOfWeek: string
  }
}

interface AssistantActionHowManyLeft {
  type: 'how_many_left'
}

type NowOrWill = 'now' | 'will'

interface AssistantActionWhere {
  type: 'where'
  note?: {
    when: NowOrWill
  }
}

interface AssistantActionWhatLesson {
  type: 'what_lesson'
  note: {
    when: NowOrWill
  }
}

interface AssistantActionFirstLesson {
  type: 'first_lesson'
  note: {
    dayOfWeek: string
  }
}

interface AssistantActionDaySchedule {
  type: 'day_schedule'
  note: [
    {
      dayOfWeek: string
    },
      null | unknown,
      null | unknown,
  ]
}

interface AssistantActionShowSchedule {
  type: 'show_schedule'
}

interface AssistantActionGroup {
  type: 'group'
  note: [
    number,
    {
      data: {
        groupName: [string, string]
      }
    }
  ]
}

interface AssistantActionSubgroup {
  type: 'subgroup'
  note: string
}

export type AssistantAction = AssistantActionProfile
  | AssistantActionForToday
  | AssistantActionForTomorrow
  | AssistantActionForNextWeek
  | AssistantActionForThisWeek
  | AssistantActionWhenLesson
  | AssistantActionHowMany
  | AssistantActionHowManyLeft
  | AssistantActionWhere
  | AssistantActionWhatLesson
  | AssistantActionFirstLesson
  | AssistantActionDaySchedule
  | AssistantActionShowSchedule
  | AssistantActionGroup
  | AssistantActionSubgroup;

//

interface AssistantEventSmartAppData {
  type: 'smart_app_data'
  sub: string               // идентификатор пользователя
  action: AssistantAction
}

export type AssistantEvent = AssistantEventCharacter
  | AssistantEventSmartAppData

//
