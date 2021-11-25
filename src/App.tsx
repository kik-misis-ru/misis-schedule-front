import React from "react";
import { Router, Route, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import 'react-toastify/dist/ReactToastify.css';
import { detectDevice } from '@sberdevices/plasma-ui/utils';

import number from './language-ru/Number';
import DayOfWeek from './language-ru/DayOfWeek';

import {
  createUser,
  getGroupById,
  getGroupByName,
  getIdTeacherFromDb,
  getInTeacherFromDb,
  getScheduleFromDb,
  getScheduleTeacherFromDb,
  getUser,
  IsEnglishGroupExist,
  IScheduleApiData,
  IScheduleLessonInfo, ITeacherApiData,
  IScheduleFormatData,
  getSchedulebyUserId,
  FormateSchedule, ITeacherInfo
} from "./lib/ApiHelper";
import ApiModel from "./lib/ApiModel";

import DashboardPage from './pages/DashboardPage';

import HomePage from './pages/HomePage';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import Start from './pages/Start';
import NavigatorPage from './pages/NavigatorPage';
import SpinnerPage from "./pages/SpinnerPage";
import SchedulePage from './pages/SchedulePage';
import Settings from './pages/Settings';

import buildings from './data/buldings.json'
import filial from './data/filial.json';
import breaks from './data/breaks.json';


import "./themes/App.css";
import {
  AssistantCharacter,
  AssistantAction,
  AssistantEvent,
  AssistantEventCharacter,
  AssistantEventSmartAppData,
  NowOrWill,
} from './types/AssistantReceiveAction.d'
import {
  AssistantSendAction,
  AssistantSendActionSay,
  AssistantSendActionSay1,
  AssistantSendActionSay5,
  AssistantSendActionSay6,
} from './types/AssistantSendAction.d'

import {
  CHAR_SBER,
  CharacterId,
  DAY_NOT_SUNDAY,
  DAY_SUNDAY,
  DAY_TODAY,
  DAY_TOMORROW,
  IDayHeader,
  LESSON_EXIST,
  OTHER_WEEK,
  StartOrEnd,
  THIS_OR_OTHER_WEEK,
  THIS_WEEK,
  TodayOrTomorrow,
} from './types/base.d'
import {
  formatDateWithDashes,
  formatDateWithDots,
  formatTimeHhMm,
  MS_IN_DAY,
  pairNumberToPairText
} from './utils';
import Lesson from "./pages/Lesson";
import { AssistantWrapper } from './lib/AssistantWrapper';

export const HOME_PAGE_ROUTE = "home";

const INITIAL_PAGE = 16;

const SEVEN_DAYS = 7 * MS_IN_DAY;
const FILL_DATA_NO_OFFICIAL_TEXT = "Заполни данные, чтобы открывать расписание одной фразой";
const TO_VIEW_OFFICIAL_TEXT = "Чтобы посмотреть расписание, укажите данные учебной группы";

/**
 * Время начала и конца пар
 */

export interface StartEnd {
  start: string
  end: string
}

export interface ICheckIsCorrect {
  correct_sub: boolean
  correct_eng: boolean
  correct: boolean
}


const MAX_BELL_COUNT = 8;

const FIRST_DAY_OTHER_WEEK = 8;

export const LessonStartEnd: StartEnd[] = Array(MAX_BELL_COUNT).fill({ start: "", end: "" })

/**
 *
 */
const TODAY_TOMORROW_DICT = {
  [DAY_TODAY]: 1,
  [DAY_TOMORROW]: 0,
}


export const history = createBrowserHistory();


interface IAppProps {
}

export interface IAppState {
  notes: { id: string, title: string }[];
  userId: string
  page: number
  // logo
  flag: boolean
  checked: boolean
  description: string
  group: string
  groupId: string
  filialId: string
  correct: boolean
  
  spinner: boolean
  date: number
  today: number
  character: CharacterId
  theme: string
  dayPush: number
  isGroupError: boolean
  isActive: boolean
  subGroup: string
  group_id_bd: string
  eng_bd: string
  sub_bd: string
  isSubGroupError: boolean
  engGroup: string
  isEngGroupError: boolean
  isUser: boolean
  bd: string
  student: boolean

  teacher: string
  teacherId: string
  teacher_checked: boolean
  teacher_bd: string
  teacher_id_bd: string
  teacher_correct: boolean

  isTeacherError: boolean
  // building: IBuilding[]
}

export class App extends React.Component<IAppProps, IAppState> {
  assistant: AssistantWrapper
  apiModel: ApiModel

  constructor(props: IAppProps) {
    super(props);
    this.apiModel = new ApiModel();

    this.setValue = this.setValue.bind(this)
    this.Load_Schedule = this.Load_Schedule.bind(this)
    this.CheckIsCorrect = this.CheckIsCorrect.bind(this)
    this.handleTeacherChange = this.handleTeacherChange.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    this.getCurrentLesson = this.getCurrentLesson.bind(this);
    this.NextWeek = this.NextWeek.bind(this);
    this.CurrentWeek = this.CurrentWeek.bind(this);
    this.PreviousWeek = this.PreviousWeek.bind(this);
    this.getIsCorrectTeacher = this.getIsCorrectTeacher.bind(this);
    // this.sendAssistantData = this.sendAssistantData.bind(this);
    this.ChangeTheme = this.ChangeTheme.bind(this);
    this.Load_Schedule = this.Load_Schedule.bind(this);
    this.getScheduleFromDb = this.getScheduleFromDb.bind(this);
    // this.tfRef                = React.createRef();
    console.log('constructor');
    history.push("/dashboard")
    this.state = {
      notes: [],
      //
      userId: "",
      //
      page: INITIAL_PAGE,
      // logo: null,
      flag: true,
      checked: false,
      description: "",
      group: "",
      groupId: "",
      filialId: "",
      subGroup: "",
      engGroup: "",
      bd: "",
      group_id_bd: "",
      eng_bd: "",
      sub_bd: "",
      correct: false,
      spinner: false,
      date: Date.now() + 1,
      today: 0,
      theme: "dark",
      isGroupError: false,
      isTeacherError: false,
      isSubGroupError: false,
      isEngGroupError: false,

      isActive: false,

      character: CHAR_SBER,
      isUser: false,
      student: true,
      dayPush: 0,
      teacher: "",
      teacherId: "",
      teacher_checked: false,
      teacher_bd: "",
      teacher_id_bd: "",
      teacher_correct: false,
    }
    this.assistant = new AssistantWrapper(this);
  }


  componentDidMount() {
    console.log('componentDidMount');
    this.assistant.init();
  }

  //////////////////////////////////////////////////////////////////////////////

  handleAssistantCharacter(character: AssistantCharacter) {

    this.setState({
      character: character.id,
      description: character.appeal === 'no_official'
        ? FILL_DATA_NO_OFFICIAL_TEXT
        : TO_VIEW_OFFICIAL_TEXT
    });
  }

  async handleAssistantSub(eventSub: string) {
    console.log("handleAssistantSub: eventSub", eventSub);
    const userId = eventSub;

    this.setState({ userId });

    const now = new Date();
    this.setState({ today: now.getDay() });
    await this.apiModel.fetchUser(userId)
    const user = this.apiModel.user;
    if (this.apiModel.userId!=undefined && this.apiModel.userId!="") {
      const userSchedule = await getSchedulebyUserId(userId)
      // .then((userSchedule) => {
      console.log("handleAssistantSub: getScheduleByUserId", userSchedule)

      this.apiModel.pushSettings={
        IsActive: userSchedule.isActive,
        Hour: userSchedule.hour,
        Minute: userSchedule.minute,
      }
      await this.apiModel.getSchedulebyUserId()
      this.setState({ spinner: true });
      console.log("USER:",this.apiModel)
      history.push("/dashboard")
    if(!this.apiModel.isSavedUser){
      console.log("handleAssistantSub: first time")

      this.setState({ isUser: true });

      history.push('/start')

      this.assistant.sendHello()

     await this.apiModel.createUser()
    }
  }
  }


  async dispatchAssistantAction(action: AssistantAction) {
    console.log('dispatchAssistantAction:', action)
    if (action) {
      switch (action.type) {

        case 'settings':
          console.log('dispatchAssistantAction: PUSH');
          break;

        case 'profile':
          console.log('dispatchAssistantAction: profile');
          history.push("/home")
          break;

        case 'set_eng_group':
          console.log('dispatchAssistantAction: pathname:', history.pathname)
          if (action.group != undefined) {
            this.setState({ engGroup: String(action.group) })
          }
          break

        case 'for_today':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today === 0) {

              this.assistant.sendTodayScheduleSunday();
              return this.ChangeDay(7);

            } else {
              this.assistant.sendTodayScheduleNotSunday();
              return this.ChangeDay(this.state.today);
            }
          break;

        case 'for_tomorrow':
          if ((this.state.group !== "") || (this.state.teacher !== ""))

            if (this.state.today + 1 === 7) {
              this.assistant.sendTomorrowScheduleSunday()
              return this.ChangeDay(7);

            } else {
              this.assistant.sendTomorrowScheduleNotSunday()
              return this.ChangeDay(this.state.today + 1);
            }
          break;

        case 'for_next_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            await this.NextWeek(this.apiModel.isSavedSchedule);
            return this.ChangeDay(FIRST_DAY_OTHER_WEEK);
          }
          break;

        case 'for_this_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.setState({
              date: Date.now(),
              flag: true,
            });
            history.push('/spinner')
            return
          }
          break;

        case 'when_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let params: AssistantSendActionSay['parameters'];
            let dayOfWeekZeroIndex = 0;
            const [type, day, lessonNum] = action.note || [];
            day == "today" ? dayOfWeekZeroIndex = this.state.today - 1 : dayOfWeekZeroIndex = this.state.today;

            let answer = this.getStartEndLesson(type, dayOfWeekZeroIndex, lessonNum)


            console.log('dispatchAssistantAction: answer:', answer)
            if (answer !== undefined && answer[1] === DAY_SUNDAY) {
              params = {
                type: answer[0],
                day: answer[1],
              }
            } else {
              params = {
                type: type,
                day: day,
                ordinal: number.ordinal.fem.singular.nominative[lessonNum],
                time: answer
              }
            }
            this.assistant.sendAction({
              action_id: "say",
              parameters: params,
            })

            if ((params.day === DAY_TODAY) && (this.state.today !== 0)) {
              return this.ChangeDay(this.state.today);
            } else if (this.state.today + 1 === 7) {
              return this.ChangeDay(7);
            } else {
              this.ChangeDay(this.state.today + 1);
            }
          }
          break

        case 'how_many':
          let amountOfLessonsTuple: [string, number] | undefined;
          let day: TodayOrTomorrow | undefined;
          let date;
          let page = 0;
          console.log("dispatchAssistantAction: how_many: group:", this.state.group, ", teacher:", this.state.teacher)
          if ((this.state.group !== "") || (this.state.teacher !== "")) {

            if (action.note !== undefined) {

              const { timestamp, dayOfWeek: dayOfWeekStrIndex } = action.note;
              date = new Date(timestamp);
              // amountOfLessonsTuple = this.getLessonsCountForDate(date)
              console.log('dispatchAssistantAction: how_many', timestamp, amountOfLessonsTuple, "how many")

              // todo: упростить
              if (String(this.state.today + 1) === dayOfWeekStrIndex) {
                day = DAY_TODAY;
                page = 0
              } else if (String(this.state.today + 2) === dayOfWeekStrIndex) {
                day = DAY_TOMORROW;
                page = 0
              } else { // fallback
                day = undefined
                page = 0
              }
            } else {
              date = new Date(new Date());
              // amountOfLessonsTuple = this.getLessonsCountForDate(date)
              day = DAY_TODAY
            }

            let howManyParams: AssistantSendActionSay1['parameters'] = {
              day: DAY_SUNDAY,
            };

            const lessonCount = this.getLessonsCountForDate(date)

            if (this.state.group !== "" && amountOfLessonsTuple !== undefined) {
              // const [dayOfWeekShort, lessonCount] = amountOfLessonsTuple;
              const lessonText = pairNumberToPairText(lessonCount);

              // const [dayOfWeekLongPrepositional, dayOfWeekIndex] = dayNameDict[dayOfWeekShort]
              // const dayOfWeekIndex = DayOfWeek.short.indexOf(dayOfWeekShort)
              const dayOfWeekIndex = date.getDay(date); 
              const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekIndex]?.toLowerCase();
              
              howManyParams = {
                lesson: lessonText,
                day: day,
                dayName: dayOfWeekLongPrepositional,
                amount: number.cardinal.fem[lessonCount]
              }
              if (dayOfWeekIndex < this.state.today) {
                page = 7;
              }
              this.ChangeDay(dayOfWeekIndex + page)
            }

            this.assistant.sendAction({
              action_id: "say1",
              parameters: howManyParams,
            })
          }
          break

        case 'how_many_left':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let howManyLeftParams
            let amountOfRemainingLessons = this.getAmountOfRemainingLessons(new Date(Date.now()))
            if (this.state.today === 0) {
              howManyLeftParams = {
                day: DAY_SUNDAY,
              }
            } else {
              howManyLeftParams = {
                amount: amountOfRemainingLessons,
                pron: number.cardinal.fem[amountOfRemainingLessons]
              }
            }
            this.assistant.sendAction({
              action_id: "say2",
              parameters: howManyLeftParams,
            })
            if (this.state.group !== "")
              this.ChangePage();
            if (this.state.today === 0) {
              this.gotoPage(7)
            } else {
              this.gotoPage(this.state.today)
            }
          }
          break

        case 'where':
          console.log('dispatchAssistantAction: where')
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = {
                "when": "now",
              }
            }
            const whereLessonParams = this.whereWillLesson(new Date(this.state.date), action.note.when)
            this.assistant.sendAction({
              action_id: "say3",
              parameters: whereLessonParams,
            })
            if (whereLessonParams.exist === DAY_SUNDAY) {
              //this.setState({ page: 8 })
            } else {
              this.ChangeDay(this.state.today);
            }
          }
          break

        case 'what_lesson':
          console.log("dispatchAssistantAction: what_lesson: какая пара")
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (!action.note) {
              action.note = {
                "when": "now",
              }
            }
            const whatLesson = this.whatLesson(new Date(), action.note.when);
            console.log('dispatchAssistantAction: what_lesson: whatLesson:', whatLesson)
            this.assistant.sendAction({
              action_id: "say4",
              parameters: whatLesson,
            })
            if (this.state.today === 0) {
              this.ChangeDay(7)
            } else {
              this.ChangeDay(this.state.today);
            }
          }
          break

        case 'first_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let firstLessonNumStr: string;
            // let day: TodayOrTomorrow;
            let day1: undefined | TodayOrTomorrow = DAY_TODAY;
            let page1 = 0;
            if (action.note !== undefined) {
              const { dayOfWeek: strDayOfWeek } = action.note;
              const numDayOfWeek = parseInt(strDayOfWeek) - 1
              console.log('dispatchAssistantAction: first_lesson:', action.note)
              console.log('dispatchAssistantAction: first_lesson:', numDayOfWeek);
              firstLessonNumStr = this.getStartFirstLesson(numDayOfWeek)[1]
              if (String(this.state.today + 1) === strDayOfWeek) {
                day1 = DAY_TODAY;
                page1 = 0
              } else if (String(this.state.today + 2) === strDayOfWeek) {
                day1 = DAY_TOMORROW;
                page1 = 0
              } else {

                day1 = undefined;
              }
            } else {
              console.warn('dispatchAssistantAction: first_lesson: action.note is undefined');
              // todo: fix fallback
              firstLessonNumStr = this.getStartFirstLesson(0)[1];
              // day = DAY_TODAY
              day1 = undefined
            }
            let whichFirst: AssistantSendActionSay5['parameters'] = {
              day1: DAY_SUNDAY,
            }
            if (firstLessonNumStr !== undefined) {
              const { dayOfWeek: dayOfWeekStrIndex } = action.note;
              const dayOfWeekIndex = parseInt(dayOfWeekStrIndex) - 1
              const dayOfWeekShort = DayOfWeek.short[dayOfWeekIndex];

              
              // const 
              // const [dayOfWeekLongPrepositional, dayOfWeekIdx1] = dayNameDict[dayOfWeekShort];
              const dayOfWeekIndex_ = DayOfWeek.short.indexOf(dayOfWeekShort)
              const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekIndex_]?.toLowerCase();

              whichFirst = {
                num: number.ordinal.fem.singular.genitive[firstLessonNumStr/*[0]*/],
                day: day1,
                dayName: dayOfWeekLongPrepositional
              }
              console.log('dispatchAssistantAction: whichFirst:', whichFirst)
              if (dayOfWeekIndex_ < this.state.today) {
                page1 = 7;
              }

              const newPage = dayOfWeekIndex_ + page1;
              this.gotoPage(newPage)
            }
            this.assistant.sendAction({
              action_id: "say5",
              parameters: whichFirst,
            })
          }
          break

        case 'day_schedule':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let page2 = 0;

            // todo: упростить

            if ((action.note[1] === null) && (action.note[2] === null)) {
              if (!this.state.flag) {
                console.log('dispatchAssistantAction: day_schedule: flag:', this.state.flag);
                page2 = 7;
              } else {
                page2 = 0;
              }

            } else {
              console.log('dispatchAssistantAction: day_schedule: note:', action.note)
              console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', parseInt(action.note[0].dayOfWeek) - 1);

              if (action.note[1] !== null) {
                console.log('dispatchAssistantAction: day_schedule: note[1]:', action.note[1]);
                page2 = 0;
              } else if (action.note[2] !== null) {
                console.log('dispatchAssistantAction: day_schedule: note[2]:', action.note[2]);
                page2 = 7;
              }
            }

            let daySchedule: AssistantSendActionSay6['parameters'];
            // if (this.state.group !== "") {
            const { dayOfWeek: dayOfWeekStrIndex } = action.note[0];
            const dayOfWeekZeroIndex = parseInt(dayOfWeekStrIndex) - 1;
            console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', dayOfWeekZeroIndex)
            
            // const [dayOfWeekLongPrepositional, dayOfWeekIdx1] = dayNameDict[this.state.day[dayOfWeekZeroIndex - 1].title];
            const dayOfWeekShort = this.apiModel.day[dayOfWeekZeroIndex-1].title;
            const dayOfWeekIndex_ = DayOfWeek.short.indexOf(dayOfWeekShort)
            const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekIndex_]?.toLowerCase();

            daySchedule = {
              dayName: dayOfWeekLongPrepositional,
            }

            const newPage = dayOfWeekIndex_ + page2;
            this.gotoPage(newPage)
            // }
            this.assistant.sendAction({
              action_id: "say6",
              parameters: daySchedule,
            })
          }
          break

        case 'show_schedule':
          console.log('dispatchAssistantAction: show schedule');
          if (action.note) {

            const isStudent = !action.note.includes("препод")

            this.assistant.sendAction({
              action_id: "change_group",
              parameters: {
                IsStudent: isStudent
              }
            })

          } else {
            let success = true;
            if (history.location == HOME_PAGE_ROUTE) {
              if (this.state.student) {
                success = await this.CheckIsCorrect()
              } else {
                success = await this.handleTeacherChange(true);
              }
            }
            if (success) {
              await this.Load_Schedule(this.apiModel.isSavedSchedule)
              history.push('/spinner')
            }

          }
          break;

        case 'show_settings':
          history.push("/settings")
          break;

        case 'navigation':
          console.log("показать навигацию");
          history.push('/navigation')
          break;

        case 'faq':
          history.push('/faq')
          break;

        case 'contacts':
          history.push('/contacts')
          break;

        case 'group':
          console.log('dispatchAssistantAction: group: action:', action)
          let group = action.note[0] === 0
            ? action.note[1].data.groupName[0]
            : action.note[1].data.groupName[1];
          group = group.toUpperCase();
          this.setState({
            group,
          });
          break

        case 'dashboard':
          history.push("/dashboard")
          break;

        case 'subgroup':
          const subGroup = action.note;
          this.setState({
            subGroup,
          });
          //history.push('/home')
          break

        case 'show_home_page':
          history.push('/home')
          break

        default:
        //throw new Error();
      }
    }
  }


  getStateForAssistant() {
    console.log('getStateForAssistant: this.state:', this.state)
    const state = {
      item_selector: {
        items: this.state.notes.map(
          ({ id, title }, index) => ({
            number: index + 1,
            id,
            title,
          })
        ),
      },
    };
    console.log('getStateForAssistant: state:', state)
    return state;
  }


  // sendAssistantData(action: AssistantSendAction) {
  //   this.assistant.sendAction(action)
  //   // console.log(action);
  //   // return this._assistant.sendData({
  //   //   action
  //   // })
  // }                          ``


  //////////////////////////////////////////////////////////////////////////////


  TimeByLessonNum(num: number): string {
    return LessonStartEnd[num].start + " - " + LessonStartEnd[num].end
  }

  setValue(key: string, value: any) {
    console.log(`setValue: key: ${key}, value:`, value);
    //console.log(this.state.group)
    switch (key) {
      case "group":
        this.setState({ group: value });
        break;
      case "subGroup":
        this.setState({ subGroup: value });
        break;
      case "teacher":
        this.setState({ teacher: value });
        break;
      case "page":
        this.gotoPage(value);
        break;
      case "student":
        this.setState({ student: value });
        break;
      case "teacher_checked":
        this.setState({ teacher_checked: value });
        break;
      case "engGroup":
        this.setState({ engGroup: value });
        break;
      case "checked":
        this.setState({ checked: value });
        break;
      case "description":
        this.setState({ description: value });
        break;
      case "bd":
        this.setState({ bd: value });
        break;
      case "teacher_bd":
        this.setState({ teacher_bd: value })
        break;
      case "flag":
        this.setState({ flag: value })
        break;
      default:
        break;
    }
  }

  getIsCorrectTeacher(): boolean {
    const isStudent = this.state.student;
    const isTeacherCorrect = this.state.teacher_correct;
    return !isStudent && isTeacherCorrect
  }
  /**
   *
   * @param dayNumber
   * @returns {[
   *   string,   -- строка, содержащая начало пары
   *   string,   -- порядковый номер пары (1 символ)
   * ]}
   */
  getStartFirstLesson(dayNumber: number): [string, string] {
    let lessonsStart = '';
    let lessonNumber = '';
    let week: THIS_OR_OTHER_WEEK = THIS_WEEK;
    if (dayNumber < this.state.today) {
      week = OTHER_WEEK;
    }
    for (let lessonIdx in this.apiModel.saved_schedule[dayNumber - 1]) {
      const lesson = this.apiModel.saved_schedule[dayNumber - 1][lessonIdx][week]
      if (lesson.lessonName !== "") {
        lessonsStart = LessonStartEnd[Number(lessonIdx)].start
        console.log('getStartFirstLesson: lessonIdx:', lessonIdx)
        lessonNumber = String(Number(lessonIdx) + 1);
        break
      }
    }
    return [lessonsStart, lessonNumber];
  }


  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(todayOrTomorrow: number): string {
    let lessonEnd = '';
    for (let lessonIdx in this.apiModel.saved_schedule[todayOrTomorrow]) {
      if (this.apiModel.saved_schedule[todayOrTomorrow][lessonIdx][THIS_WEEK].lessonName !== "") {
        lessonEnd = LessonStartEnd[lessonIdx].end;
      }
    }
    return lessonEnd;
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(startOrEnd: StartOrEnd, dayOfWeekIndex: number, lessonNum: number): string | undefined {

    const lessonName = this.apiModel.saved_schedule[dayOfWeekIndex][lessonNum - 1][THIS_WEEK].lessonName;

    if (lessonName !== "") {
      if (startOrEnd === "start") {
        return LessonStartEnd[lessonNum - 1].start
      } else {
        return LessonStartEnd[lessonNum - 1].end
      }
    }
  }

  getStartEndLesson(
    startOrEnd: StartOrEnd,
    dayOfWeekIndex: number,
    // todo: lessonNum строка или число ???
    lessonNum,
  ): string | [string, string] | undefined {
    if (dayOfWeekIndex === 0) {
      return [String(dayOfWeekIndex), DAY_SUNDAY]

    } else if (dayOfWeekIndex === 7) {
      return [String(dayOfWeekIndex), DAY_SUNDAY]

    } else if (startOrEnd === "start") {
      if (dayOfWeekIndex === this.state.today) {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(dayOfWeekIndex)[0]
        } else {
          return this.getBordersRequestLesson(startOrEnd, dayOfWeekIndex, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(dayOfWeekIndex)[0]
        } else {
          return this.getBordersRequestLesson(startOrEnd, dayOfWeekIndex, lessonNum)
        }
      }
    } else if (startOrEnd === "end") {
      if (dayOfWeekIndex === this.state.today) {
        if (lessonNum === "0") {
          return this.getEndLastLesson(dayOfWeekIndex)
        } else {
          return this.getBordersRequestLesson(startOrEnd, dayOfWeekIndex, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getEndLastLesson(dayOfWeekIndex)
        } else {
          return this.getBordersRequestLesson(startOrEnd, dayOfWeekIndex, lessonNum)
        }
      }
    }
  }


  // /**
  //  * подсчет количества пар в указанную дату
  //  * возвращает массив с днем недели (Пн,Вт,...)
  //  * и количеством пар в этот день
  //  *
  //  * @param {Date} date
  //  * @returns [string,number]|undefined
  //  */
  // getAmountOfLessons__(date: Date): [string, number] | undefined {
  //   for (let i = 0; i < 6; i++) {
  //     let day = this.state.day
  //     if (formatDateWithDots(date) === day.current_week[i].date) {
  //       return [day.current_week[i].title, day.current_week[i].count]
  //     }
  //     if (formatDateWithDots(date) === day.other_week[i].date) {
  //       return [day.current_week[i].title, day.other_week[i].count]
  //     }
  //   }
  //   // if (res !== undefined) {return res}
  //   // else {return null}
  // }

  /**
   * подсчет количества пар в указанную дату
   * возвращает короткое название дня недели (Пн,Вт,...)
   * и количество пар в этот день
   *
   * @param {Date} date
   * @returns number
   */
  getLessonsCountForDate(date: Date): number {
    const strDate = formatDateWithDots(date);
    for (let i = 0; i < 6; i++) {
      let current_week = this.apiModel.day.current_week
      if (strDate === current_week[i].date) {
        return current_week[i].count;
      }
    }
    return -1;
  }
  
  /**
   * возвращает короткое название дня недели (Пн,Вт,...)
   * для заданной даты
   *
   * @param {Date} date
   * @returns string
   */
  getDayOfWeekShortForDate(date: Date): string {
    // Возвращает порядковый номер дня недели на заданную дату
    // 0 - воскресенье, 1 - понедельник
    const dayOfWeekIndexForDate = date.getDay();
    return DayOfWeek.short[dayOfWeekIndexForDate];
  }

  /**
   * получить текущую пару
   *
   * @param date
   */
  getCurrentLesson(date: Date): string {
    if (this.state.today !== 0) {
      const todayIndex = this.state.today - 1
      const day = this.apiModel.saved_schedule[todayIndex]
      for (let bellIdx in day) {
        // console.log(`getCurrentLesson: bellIdx: ${bellIdx}, typeof bellIdx: ${typeof bellIdx}`);
        const lesson = day[bellIdx][THIS_WEEK];
        const thisLessonStartEnd = LessonStartEnd[Number(bellIdx)];
        if (
          (formatTimeHhMm(date) > thisLessonStartEnd.start) &&
          (formatTimeHhMm(date) < thisLessonStartEnd.end) &&
          (thisLessonStartEnd.start !== "")
        ) {
          return lesson.lessonNumber
        }
      }
    }
    return '';//'-1';
  }

  /**
   * возвращает количество оставшихся на сегодня пар
   *
   * @param {Date} date
   * @return {number}
   */
  getAmountOfRemainingLessons(date: Date): number {
    let countRemainingLessons = 0
    if ((this.state.today !== 0) && (this.state.today + 1 !== 7))
      for (let bell in this.apiModel.saved_schedule[this.state.today - 1]) {
        if (
          formatTimeHhMm(date) < LessonStartEnd[Number(bell)].start &&
          LessonStartEnd[Number(bell)].start !== ""
        ) {
          countRemainingLessons += 1
        }
      }
    return countRemainingLessons
  }




  whatLesson(
    date: Date,
    when: NowOrWill | 'next',
  ): {
    lesson: string | undefined,
    type: NowOrWill | 'next',
    num: number,
  } { //определяет название пары, которая идет или будет
    // ключ - номер пары, значение - перерыв до этой пары

    console.log(`whatLesson: when: ${when} date:`, date)

    const isSunday = (this.state.today === 0)
    const todayWorkDayZeroIndex = this.state.today - 1;
    const todayBells = this.apiModel.day.current_week[todayWorkDayZeroIndex]
    const todayLessons = this.apiModel.saved_schedule[todayWorkDayZeroIndex]

    if (isSunday) {
      const result = {
        lesson: undefined,
        type: when,
        num: -1,
      }
      console.log(`whatLesson: isSunday: result:`, result)
      return result;

    } else {
      console.log('whatLesson: count:', todayBells.count[THIS_WEEK]);
      const firstLessonTimeHhMm = this.getStartFirstLesson(todayWorkDayZeroIndex + 1)[0];

      // if (formatTimeHhMm(date) < firstLessonTimeHhMm) {
      //   console.log('formatTimeHhMm(date) < firstLessonTimeHhMm: true')
      // }
      console.log("whatLesson: что за пара", formatTimeHhMm(date), when, firstLessonTimeHhMm);

      // if (this.state.today !== 0) {
      const currLessonNum = this.getCurrentLesson(date);

      //
      if (
        (when === "now") &&
        (currLessonNum !== undefined)
      ) {
        for (let bellIdx in todayLessons) {
          const lesson = todayLessons[bellIdx][THIS_WEEK];

          if (
            (lesson.lessonNumber === currLessonNum) &&
            (lesson.lessonNumber !== "")
          ) {
            return {
              lesson: lesson[0],
              type: "now",
              num: parseInt(currLessonNum)
            };
          }
        }

      } else if (
        (when === "will") &&
        (currLessonNum !== undefined) &&
        (parseInt(currLessonNum) + 1 < 8)
      ) {
        console.log("whatLesson: будет")
        for (let bell in todayLessons) {
          console.log('whatLesson:', parseInt(currLessonNum) + 1);
          const lesson = todayLessons[bell][THIS_WEEK];

          if (
            (lesson.lessonNumber == String(parseInt(currLessonNum) + 1)) &&
            (lesson.lessonNumber !== "")
          ) {
            return {
              lesson: lesson[0],
              type: "next",
              num: parseInt(currLessonNum) + 1
            };
          }
        }
      } else if (
        (this.getStartFirstLesson(todayWorkDayZeroIndex)[0] !== undefined) &&
        (this.getStartFirstLesson(todayWorkDayZeroIndex)[0] >= formatTimeHhMm(date))
      ) {
        const firstLessonInfo = this.getStartFirstLesson(todayWorkDayZeroIndex)
        console.log('whatLesson:', firstLessonInfo[1]);

        const lessonNumber = parseInt(firstLessonInfo[1]);
        return {
          lesson: todayLessons[lessonNumber][0][0],
          type: "will",
          num: lessonNumber,
        }
      } else {
        for (let i in breaks) {
          if (
            (
              formatTimeHhMm(date) > breaks[i].start &&
              formatTimeHhMm(date) < breaks[i].end
            ) &&
            (todayLessons[i][0][5][0] !== "")
          ) {
            return {
              lesson: todayLessons[i][0][0],
              type: "will",
              num: parseInt(i)
            };
          } else {
            return {
              lesson: undefined,
              type: when,
              num: -1
            };
          }
        }
      }
      // }
    }
    const result = {
      lesson: undefined,
      type: when,
      num: -1,
    }
    console.log(`whatLesson: not found: result:`, result)
    return result;
  }


  // определяет ближайшую пару, если сейчас идет какая то пара, то сообщает об этом
  whereWillLesson(
    date: Date,
    will: NowOrWill,
  ): {
    audience?: string
    type?: 'current' | 'nearest' | 'next'
    exist?: LESSON_EXIST
  } {
    let nextLessonRoom
    let numberNearestLesson

    // проверяем, что сегодня не воскресенье
    const isSunday = (this.state.today === 0)

    if (!isSunday) {

      // определяем номер ближайшей пары
      for (let i in breaks) {

        if (formatTimeHhMm(date) < breaks['1'].start) {
          numberNearestLesson = '1';
          break
        } else if (
          formatTimeHhMm(date) > breaks[i].start &&
          formatTimeHhMm(date) < breaks[i].end
        ) {
          numberNearestLesson = i;
          break
        } else if (formatTimeHhMm(date) > breaks['7'].start) {
          numberNearestLesson = null
        }
      }
      // const amountOfLessonsTuple = [
      //   this.getDayOfWeekShortForDate(date),
      //   this.getLessonsCountForDate(date),
      // ]
      // if (amountOfLessonsTuple && amountOfLessonsTuple[1] === 0) {
      const lessonCount = this.getLessonsCountForDate(date);
      if (lessonCount <= 0) {
        return {
          exist: "empty",
        }
      }
      if (numberNearestLesson !== undefined) {
        for (let bell in this.apiModel.saved_schedule[this.state.today - 1]) {
          // если пара с таким номером есть в расписании
          if (this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].lessonNumber === numberNearestLesson) {
            return {
              audience: this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`whereWillLesson: Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.apiModel.saved_schedule[this.state.today - 1]) {
              if (this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].lessonNumber !== numberNearestLesson) {
                return {
                  audience: this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].room,
                  type: "nearest",
                  exist: "notInSchedule",
                }
              }
            }
          }
        }
      }
      if (numberNearestLesson === undefined && will === "now") {
        // вернуть номер текущей пары
        let whereCurrentLesson
        for (let bell in this.apiModel.saved_schedule[this.state.today - 1]) {
          if (this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].lessonNumber === this.getCurrentLesson(date)) {
            whereCurrentLesson = this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].room
          }
        }
        if (whereCurrentLesson === "") {
          return {
            exist: "notInSchedule",
          }
        } else {
          return {
            audience: whereCurrentLesson,
            type: "current",
          }
        }
      }
      if (numberNearestLesson === undefined && will === "will") {
        for (let bell in this.apiModel.saved_schedule[this.state.today - 1]) {
          if (this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].lessonNumber === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = this.apiModel.saved_schedule[this.state.today - 1][bell][THIS_WEEK].room
          }
        }
        if (nextLessonRoom !== "") {
          return {
            audience: nextLessonRoom,
            type: "next",
          }
        } else {
          return {
            exist: "endLessons",
          }
        }
      }
    } else {
      return {
        exist: DAY_SUNDAY,
      }
    }
    return {};
  }

  async convertIdInGroupName(): Promise<void> {
    console.log(this.state.groupId);
    let group = await getGroupById(Number(this.state.groupId))
    this.setState({ group: group.name })
  }

  protected isTeacher() {
    return !this.state.student && this.state.teacher_correct
  }
  protected isSavedTeacher() {
    return this.state.teacher_id_bd != ""
  }

  // получить дату первого дня недели
  getFirstDayWeek(date: Date): string {
    // номер дня недели
    const now = new Date();
    this.setState({ today: now.getDay() });

    const weekDay = date.getDay()
    let firstDay: number;
    if (weekDay === 0) {
      firstDay = date.getTime() - (weekDay + 6) * MS_IN_DAY;
      console.log(formatDateWithDashes(new Date(firstDay)))
      //return null
    } else if (weekDay === 1) {
      return formatDateWithDashes(date)
    } else {
      // число первого дня недели
      firstDay = date.getTime() - (weekDay - 1) * MS_IN_DAY;
    }
    return formatDateWithDashes(new Date(firstDay))
  }


  /**
   * Заполнение расписанием на следующую неделю
   */
  async NextWeek(isSave: boolean) {
    this.setState({ spinner: false });
    const datePlusWeek = this.state.date + SEVEN_DAYS;
    return this.getScheduleFromDb(datePlusWeek, isSave, false);
  }

  async CurrentWeek(isSave: boolean) {
    return this.getScheduleFromDb(Date.now(), isSave, true);
  }

  /**
   * Заполнение расписанием на предыдущую неделю
   */
  async PreviousWeek(isSave: boolean) {
    this.setState({ spinner: false });
    const dateMinusWeek = this.state.date - SEVEN_DAYS;
    return this.getScheduleFromDb(dateMinusWeek, isSave, false);
  }

  


  ChangeDay(day: number): void {
    this.ChangePage();
    this.gotoPage(day);
  }


  ChangePage() {
    let timeParam = this.state.page;
    if ('/spinner' == history.location) {
      return
    }
    let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
    console.log("timeParam", timeParam)
    console.log("WeekParam", weekParam)
    if (timeParam > 7) {
      weekParam = OTHER_WEEK
      timeParam -= 7
    }
    if (weekParam === OTHER_WEEK) {
      console.log("OTHER WEEK")
      this.setState({ flag: false });
    } else {
      this.setState({ flag: true });
    }
  }

  ChangeTheme() {
    console.log(this.state.theme, "THEME")
    if (this.state.theme == "dark")
      this.setState({ theme: "light" })
    else this.setState({ theme: "dark" })
  }

  doSetTeacher(teacherName: string): void {
    console.log("DoSetTeacher")
    this.setState({
      teacher: teacherName
    }, async () => {
      await this.handleTeacherChange(false);
    });
  }

  // todo исправить асинхронную работу
  async handleTeacherChange(isSave: boolean): Promise<boolean> {
    console.log('handleTeacherChange: this.state.teacher:', this.state.teacher)

    let result = 1;
    await getIdTeacherFromDb(this.state.teacher).then((teacherData) => {
      console.log('handleTeacherChange:', teacherData);
      console.log('handleTeacherChange: status:', teacherData.status);

      result = Number(teacherData.status)
      if (
        (teacherData.status == "-1") ||
        (teacherData.status == "-2")
      ) {
        console.log("handleTeacherChange: teacherData.status:", teacherData.status);
        this.setState({
          isTeacherError: true
        })
        return true

      } else
        getScheduleTeacherFromDb(
          teacherData.id,
          this.getFirstDayWeek(new Date())
        ).then((response) => {
          console.log("Teahcer Shcedule", response)
          this.apiModel.SetWeekSchedule(response, 0, isSave);
        });

      console.log(this.apiModel.formatTeacherName(teacherData), "teacher name")
      getInTeacherFromDb(teacherData.id).then((parsedTeacher2) => {
        this.setState({
          teacher: this.apiModel.formatTeacherName(teacherData)
        })
      })

      this.setState({
        teacherId: teacherData.id,
        teacher_correct: true,
        date: Date.now(),
        flag: true,
        student: false,
        isTeacherError: false,
      });

      if (history.location.pathname == '/home')
        history.push('/spinner')

      if (isSave) {
        this.setState({ teacher_bd: this.state.teacher, teacher_id_bd: this.state.teacherId })
        createUser(
          this.state.userId,
          filial.id,
          this.state.groupId,
          this.state.subGroup,
          this.state.engGroup,
          this.state.teacherId,
        );
      }
      return true
    })
    return false
  }


  async _loadSchedule({ groupId, engGroup, isSave }: { groupId: string, engGroup: string, isSave: boolean }): Promise<void> {
    console.log('LOAD_SCHEDULE:', groupId, engGroup)
    await getScheduleFromDb(
      groupId,
      String(engGroup),
      this.getFirstDayWeek(new Date())
    )
      .then((response) => {
        console.log("LOAD_SCHEDULE_THEN")
        this.apiModel.SetWeekSchedule(response, 0, isSave);
        console.log('_loadSchedule:', String(this.state.engGroup), this.state.groupId);
        console.log("RESPONSE", response)
        this.setState({
          flag: true,
          isGroupError: false,
          //teacher_bd: ""
        });
      })
  }

  async Load_Schedule(isSave: boolean): Promise<void> {
    console.log("Load_Schedule. IsSave:", isSave)
    return await this._loadSchedule({
      groupId: this.state.groupId,
      engGroup: String(this.state.engGroup),
      isSave
    });
  }

  //Проверяет правильность ввода данных студента
  async CheckIsCorrect(): Promise<boolean> {
    console.log('App: isCorrect')
    this.setState({ correct: false, date: Date.now(), flag: true });
    let correct_sub = false;
    let correct_eng = false;
    let correct = false;
    console.log("this.state.engGroup", this.state.engGroup)

    let promiseGroupName = getGroupByName(this.state.group);
    let promiseEnglishGroup = IsEnglishGroupExist(Number(this.state.engGroup));

    return Promise.all([
      promiseGroupName,
      promiseEnglishGroup,
    ])
      .then((responses) => {
        console.log("App: isCorrect: response", responses)
        const [
          group_response,
          english_response,
        ] = responses;
        const group = JSON.parse(group_response);
        console.log("App: isCorrect: response: english", english_response);
        if (group.status == 1) {
          console.log(group.name, group.id, "GROUP RESPONSE")
          this.setState({ group: group.name, groupId: group.id })
          correct = true;
        }
        console.log(this.state.groupId, "group Id");
        if (english_response || this.state.engGroup == "") {
          correct_eng = true;
          console.log(`App: isCorrect: correct_eng: ${correct_eng}`);
        }
        if ((this.state.subGroup === "") || (this.state.subGroup.replace(/[\s-_.]/g, '') === "1") || (this.state.subGroup.replace(/[\s-_.]/g, '') === "2")) {
          correct_sub = true;
        }
        this.setState({ isEngGroupError: !correct_eng, isSubGroupError: !correct_sub, isGroupError: !correct })
        const groupId = String(group.id);
        let isCorrect = correct_eng && correct_sub && correct
        if ((isCorrect && this.state.checked) || (history.location.pathname != '/home')) {
          console.log("create_user", history.location.pathname)
          this.setState({
            groupId: groupId,
            group: group.name,
            bd: this.state.group,
            correct: true,
            group_id_bd: groupId,
            eng_bd: this.state.engGroup,
            sub_bd: this.state.subGroup,
            teacher_id_bd: "",
          }, () => {
            createUser(
              this.state.userId,
              filial.id,
              group.id,
              this.state.subGroup,
              this.state.engGroup,
              "")
          })
        }
        return isCorrect

      })

  }

  //Загружает расписание с бекенда
  async getScheduleFromDb(date: number, isSave: boolean, isCurrentWeek: boolean) {
    let teacher_id, group_id, eng;
    if (isSave) {
      teacher_id = this.state.teacher_id_bd;
      group_id = this.state.group_id_bd;
      eng = this.state.eng_bd
      if (this.isSavedTeacher()) {
        console.log(this.state.student)
        //this.state.student=false;
        this.setState({ student: false, teacher: this.state.teacher_bd })

      }
      else this.setState({ group: this.state.bd, student: true })
    }
    else {
      teacher_id = this.state.teacherId;
      group_id = this.state.groupId;
      eng = this.state.engGroup;
    }
    const firstDayWeek = this.getFirstDayWeek(new Date(date));
    let week = isCurrentWeek ? 0 : 1
    if (this.isSavedTeacher()) {
      await getScheduleTeacherFromDb(
        teacher_id,
        firstDayWeek
      ).then((response) => {
        this.apiModel.SetWeekSchedule(response, week, isSave);
      })
      this.setState({ student: false })
    } else {
      await getScheduleFromDb(
        group_id,
        eng,
        firstDayWeek
      ).then((response) => {
        this.apiModel.SetWeekSchedule(response, week, isSave);
      })
      this.setState({ student: true })
    }
    this.setState({ date: date, flag: true });
    console.log(this.state.student)
  }

  Spinner() {

    const CHECK_INTERVAL = 1;
    const REDIRECT_DELAY = 1;

    // делаем периодическую проверку
    const checkInterval = setInterval(() => {

      // если признак `spinner` выставлен
      if (this.state.spinner) {

        // переходим на другую страницу с задержкой
        setTimeout(() => {
          console.log("this.state.flag", this.state.flag)

          const pageNo = this.state.today === 0
            ? this.state.flag ? 7 : FIRST_DAY_OTHER_WEEK
            : this.state.flag ? this.state.today : FIRST_DAY_OTHER_WEEK
          console.log('Spinner: pageNo:', pageNo)

          // переходим на другую страницу
          this.gotoPage(pageNo);
        }, REDIRECT_DELAY);
        clearInterval(checkInterval)
      }
    }, CHECK_INTERVAL);

    return (

      <SpinnerPage
        theme={this.state.theme}
        character={this.state.character}
      />
    )
  }

  gotoPage(pageNo: number): void {
    console.log('App: gotoPage:', pageNo);
    // temporary workaround
    history.push('/');
    this.setState({ page: pageNo });
  }

  render() {
    let { page } = this.state;
    // console.log("App: render, this.state:", this.state)
    return (
      <Router history={history}>
        <Switch>
          <Route
            path="/contacts"
            render={
              ({ match }) => {
                return <Contacts
                  character={this.state.character}
                  theme={this.state.theme}
                  onDashboardClick={() => { history.push("/dashboard") }}
                />
              }
            }
          />
          <Route
            path="/faq"
            render={
              ({ match }) => {
                return <FAQ
                  character={this.state.character}
                  theme={this.state.theme}
                  onDashboardClick={() => { history.push("/dashboard") }}
                />
              }
            }
          />
          <Route
            path="/navigation"
            render={
              ({ match }) => {
                return <NavigatorPage
                  buildings={buildings}
                  character={this.state.character}
                  theme={this.state.theme}
                  isMobileDevice={detectDevice() === "mobile"}
                  onDashboardClick={() => { history.push("/dashboard") }}
                  onHomeClick={() => { history.push("/home") }}
                  onScheduleClick={() => { history.push('/spinner') }}
                />
              }
            }
          />
          <Route
            path="/settings"
            // component={
            render={
              ({ match }) => {
                return <Settings
                  userId={this.state.userId}
                  bd={this.state.bd}
                  sendAssistantData={(action: AssistantSendAction) => this.assistant.sendAction(action)}
                  teacher_bd={this.state.teacher_bd}
                  onHandleTeacherChange={this.handleTeacherChange}
                  onConvertIdInGroupName={this.convertIdInGroupName}
                  onSetValue={this.setValue}
                  description={this.state.description}
                  character={this.state.character}
                  checked={this.state.checked}
                  onDashboardClick={() => history.push("/dashboard")}
                  groupId={this.state.groupId}
                  group={this.state.group}
                  theme={this.state.theme}
                  ChangeTheme={this.ChangeTheme}
                  isGroupError={this.state.isGroupError}
                  subGroup={this.state.subGroup}
                  dayPush={this.state.dayPush}
                  isSubGroupError={this.state.isSubGroupError}
                  CheckIsCorrect={this.CheckIsCorrect}
                  engGroup={this.state.engGroup}
                  isEngGroupError={this.state.isEngGroupError}
                  LoadSchedule={() => this.Load_Schedule(true)}
                  student={this.state.student}
                  teacher={this.state.teacher}
                  isTeacherError={this.state.isTeacherError}
                  teacher_checked={this.state.teacher_checked}
                  apiModel ={this.apiModel}
                />
              }
            }
          />
          <Route
            path="/lesson/:lessonIndex"
            render={
              ({ match }) => {
                // temporary workaround
                console.log("/lesson/...: this.state.page:", this.state.page)
                // if (this.state.page!==NON_EXISTING_PAGE_NO) this.gotoPage(NON_EXISTING_PAGE_NO);
                return (
                  <Lesson
                    character={this.state.character}
                    isTeacherAndValid={this.getIsCorrectTeacher()}
                    spinner={this.state.spinner}
                    theme={this.state.theme}
                    currentLesson={this.apiModel.saved_schedule[this.state.page - 1]?.[match.params.lessonIndex - 1]?.[THIS_WEEK]}
                    currentLessonStartEnd={LessonStartEnd[match.params.lessonIndex]}
                    onGoToPage={(pageNo) => this.gotoPage(pageNo)}
                    pageNo={this.state.page}
                    onDashboardClick={() => history.push("/dashboard")}
                    handleTeacherChange={this.handleTeacherChange}

                  />
                )
              }
            }
          />
          <Route
            path="/dashboard"
            render={
              ({ match }) => {
                console.log("/dashboard: isSavedSchedule:", this.apiModel.isSavedSchedule)
                const now = new Date();
                let todayZeroIndex = this.state.today - 1;
                let currentLessonIdx = this.getCurrentLesson(now);
                let currentLesson = this.apiModel.saved_schedule[todayZeroIndex]?.[parseInt(currentLessonIdx) - 1]?.[THIS_WEEK];
                let currentLessonStartEnd = LessonStartEnd[parseInt(currentLessonIdx) - 1]

                let nextLessonIdx = this.whatLesson(now, "will").num;
                let nextLesson = this.apiModel.saved_schedule[todayZeroIndex]?.[nextLessonIdx - 1]?.[THIS_WEEK];
                //console.log(this.whatLesson(now, "will").num, "next")
                console.log('/dashboard: this.state.day:', this.apiModel.day, 'this.state.today:', this.state.today)
                let count = this.apiModel.day[todayZeroIndex]?.current_week.count;
                //console.log("COUNT", this.state.today)
                let nextLessonStartEnd = LessonStartEnd[nextLessonIdx - 1];
                let start = this.getStartFirstLesson(todayZeroIndex + 1)[0];
                let end = this.getEndLastLesson(todayZeroIndex);
                return <DashboardPage
                  character={this.state.character}
                  theme={this.state.theme}
                  isTeacherAndValid={this.getIsCorrectTeacher()}
                  start={start}
                  end={end}
                  count={count}
                  filialId={this.state.filialId}
                  userId={this.state.userId}
                  spinner={this.state.spinner}
                  currentLesson={currentLesson}
                  currentLessonStartEnd={currentLessonStartEnd}
                  nextLesson={nextLesson}
                  nextLessonStartEnd={nextLessonStartEnd}
                  groupId={this.state.group_id_bd}
                  teacherId={this.state.teacher_id_bd}
                  onGoToPage={(pageNo) => this.gotoPage(pageNo)}
                  handleTeacherChange={this.handleTeacherChange}
                  apiModel ={this.apiModel}

                />
              }
            } />
          <Route
            path="/home"
            render={
              ({ match }) => {
                return <HomePage
                  // state={this.state}
                  CheckIsCorrect={this.CheckIsCorrect}
                  LoadSchedule={this.Load_Schedule}
                  onHandleTeacherChange={this.handleTeacherChange}
                  onConvertIdInGroupName={this.convertIdInGroupName}
                  onSetValue={this.setValue}
                  description={this.state.description}
                  character={this.state.character}
                  theme={this.state.theme}
                  checked={this.state.checked}
                  onShowScheduleClick={() => { history.push('/spinner') }}
                  groupId={this.state.groupId}
                  group={this.state.group}
                  isGroupError={this.state.isGroupError}
                  subGroup={this.state.subGroup}
                  isSubGroupError={this.state.isSubGroupError}

                  engGroup={this.state.engGroup}
                  isEngGroupError={this.state.isEngGroupError}

                  student={this.state.student}
                  teacher={this.state.teacher}
                  isTeacherError={this.state.isTeacherError}
                  // handleTeacherChange={this.handleTeacherChange}
                  teacher_checked={this.state.teacher_checked}
                />
              }
            }
          />
          <Route
            path="/start"
            render={
              ({ match }) => {
                return <Start
                  character={this.state.character}
                  theme={this.state.theme}
                  isMobileDevice={detectDevice() === "mobile"}
                />
              }
            }
          />
          <Route
            path="/spinner"
            render={
              ({ match }) => {
                return this.Spinner()
              }
            }
          />
          <Route path="*">
            {
              (page >= 1 && page <= 13) &&
              <SchedulePage
                timeParam={page}
                onSetValue={this.setValue}
                teacher={this.state.teacher}
                groupName={this.state.group}
                character={this.state.character}
                theme={this.state.theme}
                isTeacher={!this.state.student}
                // Bd={this.Bd}
                getScheduleFromDb={this.getScheduleFromDb}
                bd={this.state.bd}
                teacher_bd={this.state.teacher_bd}
                PreviousWeek={() => this.PreviousWeek(this.apiModel.isSavedSchedule)}
                CurrentWeek={() => this.CurrentWeek(this.apiModel.isSavedSchedule)}
                NextWeek={() => { this.NextWeek(this.apiModel.isSavedSchedule) }}
                getCurrentLesson={this.getCurrentLesson}
                doSetTeacher={(teacherName: string) => this.doSetTeacher(teacherName)}
                weekParam={page > 7 ? 1 : 0}
                day={page > 7 ? this.apiModel.day.other_week : this.apiModel.day.current_week}
                spinner={this.state.spinner}
                today={this.state.today}
                schedule={this.apiModel.isSavedSchedule ? this.apiModel.saved_schedule : this.apiModel.other_schedule}
                group={this.state.group}
                subGroup={this.state.subGroup}
                getIsCorrectTeacher={this.getIsCorrectTeacher}
              />
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}
