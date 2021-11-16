import {
  TodayOrTomorrow,
  StartOrEnd,
} from './base.d'

//

interface AssistantEventGeneric {
  type: string
  sdk_meta: {
    mid: string //
                // "-1"
                // "1635880800399"
    requestId   // undefined
  }

}

interface AssistantEventCharacter extends AssistantEventGeneric {
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
    dayOfWeek: string
    day: string // "3"
    dayOfWeek: string // "4"
    month: string // "11"
    timestamp: number // 1635897600000
    value: string // "2021-11-03T00:00:00"
    year: string // "2021"
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
    day: string // "3"
    dayOfWeek: string // "4"
    month: string // "11"
    timestamp: number // 1635897600000
    value: string // "2021-11-03T00:00:00"
    year: string // "2021"
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

interface AssistantActionShowNavigation {
  type: 'navigation'
}

interface AssistantActionSettings {
  type: 'TAKE_RUNTIME_PERMISSIONS'
}

interface AssistantActionShowFAQ {
  type: 'faq'
}

interface AssistantActionShowContacts {
  type: 'contacts'
}
interface AssistantActionShowDashBoard{
  type: 'dashboard'
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
  | AssistantActionSubgroup
  | AssistantActionShowNavigation
  | AssistantActionShowFAQ
  | AssistantActionShowContacts
  | AssistantActionSettings
  |AssistantActionShowDashBoard;

//

interface AssistantEventSmartAppData extends AssistantEventGeneric {
  type: 'smart_app_data'
  sub: string     // идентификатор пользователя
                  // "noN0Crr3wgIDB0zPleKresJJBnQWbTybFS96aH/CO1ag1UKZFmqfjY9pgDfQAAv8DJiarMJBCd+OSKUzNTk2jw0W/jbBIC6V/xwQdmSX5cA3bAbhWkZVtK9z3zFc8Mkh3O1nZa/qn3SAagVDNjZIB6p4Z9Wzb0Lm
  user_id: string //
                  // "webdbg_userid_rwe0x9uv3qbmr4sw5uxfc"
  action: AssistantAction
  //action: "init-user"
  // sdk_meta: {mid: "1635879771615"}
  // sub: "noN0Crr3wgIDB0zPleKresJJBnQWbTybFS96aH/CO1ag1UKZFmqfjY9pgDfQAAv8DJiarMJBCd+OSKUzNTk2jw0W/jbBIC6V/xwQdmSX5cA3bAbhWkZVtK9z3zFc8Mkh3O1nZa/qn3SAagVDNjZIB6p4Z9Wzb0Lm/uzDjpy3qh0="
  // type: "smart_app_data"
  // user_id: "webdbg_userid_rwe0x9uv3qbmr4sw5uxfc"
}

interface AssistantEventInsets extends AssistantEventGeneric {
  type: "insets"
  insets: {
    bottom: number
    left: number
    right: number
    top: number
  }
}

export type AssistantEvent = AssistantEventCharacter
  | AssistantEventSmartAppData
  | AssistantEventInsets
  | undefined

//
