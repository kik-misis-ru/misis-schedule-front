import {createAssistant, createSmartappDebugger} from "@sberdevices/assistant-client";
import EventEmitter from 'eventemitter3';

import {DAY_NOT_SUNDAY, DAY_SUNDAY} from "../types/base.d";
import {
  AssistantAction,
  AssistantEvent,
  AssistantEventCharacter,
  AssistantEventSmartAppData
} from "../types/AssistantReceiveAction";
import {AssistantSendAction} from "../types/AssistantSendAction";
import {App, history} from "../App";

export const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({getState});
};

type AssistantWrapperEvents = 'event-character'
  | 'event-sub'
  | 'action-group'     //
  | 'action-subGroup'  //
  | 'action-engGroup'  //
  | 'for_today'
  | 'for_tomorrow'
  | 'show_schedule'    //
  | 'for_this_week'    //
  | 'for_next_week'    //
  | 'when_lesson'
  | 'how_many'
  | 'how_many_left'
  | 'where'
  | 'what_lesson'
  | 'first_lesson'
  | 'exit'             //
  | 'day_schedule'     //
  ;

export class AssistantWrapper extends EventEmitter<AssistantWrapperEvents> {
  _assistant
  _App: App

  constructor(_App: App) {
    super();
    this._App = _App;
  }

  init() {
    /*
    this._assistant = initializeAssistant(() => this._App.getStateForAssistant());
    */
    this._assistant = initializeAssistant(() => this.getStateForAssistantStub());

    this._assistant.on("data", (event: AssistantEvent) => {
      console.log('AssistantWrapper: _assistant.on("data"): event:', event);
      this.handleAssistantDataEvent(event);
    });

    this._assistant.on("start", (event) => {
      console.log(`AssistantWrapper: _assistant.on(start)`, event);
    });

    this._assistant.on("ANSWER_TO_USER", (event) => {
      console.log(`AssistantWrapper: _assistant.on(raw)`, event);
    });
  }

  getStateForAssistantStub() {
    console.log('getStateForAssistantStub');
    const state = {
      item_selector: {
        items: [],
        /*
                items: this.state.notes.map(
                  ({ id, title }, index) => ({
                    number: index + 1,
                    id,
                    title,
                  })
                ),
        */
      },
    };
    console.log('getStateForAssistantStub: state:', state)
    return state;
  }

  handleAssistantDataEvent(event: AssistantEvent) {
    console.log('AssistantWrapper.handleAssistantDataEvent: event:', event);

    switch (event?.type) {

      case "character":
        this.handleAssistantDataEventCharacter(event);
        break;

      case "smart_app_data":
        this.handleAssistantDataEventSmartAppData(event);
        break

      default:
        break
    }
  }

  handleAssistantDataEventCharacter(event: AssistantEventCharacter) {
    console.log('AssistantWrapper.handleAssistantEventCharacter: character.id:', event.character.id);

    this.emit('event-character', event.character);
    this._App.handleAssistantCharacter(event.character)
  }

  handleAssistantDataEventSmartAppData(event: AssistantEventSmartAppData) {
    console.log('AssistantWrapper.handleAssistantEventSmartAppData: event:', event);

    if (event.sub !== undefined) {
      this.emit('event-sub', event.sub);
      /*await*/ this._App.handleAssistantSub(event.sub);
    }

    const {action} = event;
    /*await*/ this.dispatchAssistantAction(action);
  }

  async dispatchAssistantAction(action: AssistantAction) {
    console.log('AssistantWrapper.dispatchAssistantAction:', action)

    if (!action) return;

    switch (action.type) {

      case 'settings':
        break;

      case 'profile':
      case 'show_home_page':
        this._App.handleAssistantPageChange("/home")
        break;

      case 'show_settings':
        this._App.handleAssistantPageChange("/settings")
        break;

      case 'navigation':
        this._App.handleAssistantPageChange('/navigation')
        break;

      case 'faq':
        this._App.handleAssistantPageChange('/faq')
        break;

      case 'contacts':
        this._App.handleAssistantPageChange('/contacts')
        break;

      case 'dashboard':
        history.push("/dashboard")
        break;

      case 'group':
        let group = action.note[0] === 0
          ? action.note[1].data.groupName[0]
          : action.note[1].data.groupName[1];
        group = group.toUpperCase();
        this.emit('action-group', group);
        break

      case 'subgroup':
        if (action.note) {
          const subGroup = action.note;
          this.emit('action-subGroup', subGroup);
        } else {
          console.warn('AssistantWrapper.dispatchAssistantAction: set_eng_group: action.note:', action.note)
        }
        break

      case 'set_eng_group':
        if (action.group) {
          const engGroup = String(action.group);
          this.emit('action-engGroup', engGroup);
        } else {
          console.warn('AssistantWrapper.dispatchAssistantAction: set_eng_group: action.group:', action.group)
        }
        break

      case 'for_today':
        this.emit('for_today', 0)
        await this._App.handleAssistantForDayOffset(0)
        break

      case 'for_tomorrow':
        this.emit('for_tomorrow', 1)
        await this._App.handleAssistantForDayOffset(1)
        break

      case 'for_next_week':
        this.emit('for_next_week')
        break

      case 'for_this_week':
        this.emit('for_this_week')
        break
      

      case 'when_lesson':
        const [type, day, lessonNum] = action.note || [];
        this.emit('when_lesson', type, day, lessonNum)
        await this._App.handleAssistantWhenLesson(type, day, lessonNum)
        break

      case 'how_many':
        if (action.note) {
          const {timestamp, dayOfWeek: dayOfWeekStrIndex} = action.note;
          const date = new Date(timestamp);
          this.emit('how_many', date, parseInt(dayOfWeekStrIndex))
          await this._App.handleAssistantHowMany(date, parseInt(dayOfWeekStrIndex))
        } else {
          this.emit('how_many', undefined, undefined)
          await this._App.handleAssistantHowMany(undefined, undefined)
        }
        break

      // Сколько пар осталось (сегодня)
      case 'how_many_left':
        this.emit('how_many_left')
        await this._App.handleAssistantHowManyLeft()
        break

      case 'where':
        const when = action?.note?.when ?? 'now';
        this.emit('where', when)
        await this._App.handleAssistantWhere(when)
        break

      case 'what_lesson':
        const when_ = action?.note?.when ?? 'now';
        this.emit('what_lesson', when_)
        await this._App.handleAssistantWhatLesson(when_)
        break

      case 'first_lesson':
        let dayOfWeek = parseInt(action?.note?.dayOfWeek);
        if (isNaN(dayOfWeek)) {
          console.warn('dispatchAssistantAction: first_lesson: dayOfWeek is undefined');
          dayOfWeek = 1; // Понедельник
        }
        this.emit('first_lesson', dayOfWeek)
        await this._App.handleAssistantFirstLesson(dayOfWeek)
        break

      case 'day_schedule':
       
        this.emit('day_schedule', action)
       // await this._App.handleAssistantDaySchedule(parseInt(strDayOfWeekNum_), action.note[1], action.note[2])
        break

      case 'show_schedule':
        this.emit('show_schedule');
        await this._App.handleAssistantShowSchedule(action.note)
        break

      case 'exit':
        this.emit('exit');
        this._assistant.close();
        break

      default:
      // console.warn('dispatchAssistantAction: Unknown action.type:', action.type)

    }
  }

  //

  sendAction(action: AssistantSendAction) {
    console.log(action);
    return this._assistant.sendData({
      action
    })
  }

  //

  sendHello() {
    this.sendAction({
      action_id: "hello_phrase"
    })
  }

  sendTodaySchedule(day: typeof DAY_SUNDAY | typeof DAY_NOT_SUNDAY) {
    this.sendAction({
      action_id: "todaySchedule",
      parameters: {
        day
      },
    })
  }

  sendTomorrowSchedule(day: typeof DAY_SUNDAY | typeof DAY_NOT_SUNDAY) {
    this.sendAction({
      action_id: "tomorrowSchedule",
      parameters: {
        day
      },
    })
  }

  sendSay6(dayName: string) {
    this.sendAction({
      action_id: "say6",
      parameters: {
        dayName,
      },
    })
  }

  sendChangeGroup(isStudent: boolean) {
    this.sendAction({
      action_id: "change_group",
      parameters: {
        IsStudent: isStudent
      },
    })
  }

}
