import React from "react";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";
import {Router, Route, Switch} from 'react-router';
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import {createAssistant, createSmartappDebugger,} from "@sberdevices/assistant-client";
import {detectDevice} from '@sberdevices/plasma-ui/utils';

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
  getSchedulebyUserId,
} from "./APIHelper";

import DashboardPage from './pages/DashboardPage';

import HomePage from './pages/HomePage';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import Start from './pages/Start';
import NavigatorPage from './pages/NavigatorPage';
import SpinnerPage from "./pages/SpinnerPage";
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';

import buildings from './data/buldings.json'
import filial from './data/filial.json';
import {Bell} from './types/ScheduleStructure'

import "./themes/App.css";
import {AssistantAction, AssistantEvent, NowOrWill,} from './types/AssistantReceiveAction.d'
import {
  AssistantSendAction,
  AssistantSendActionSay,
  AssistantSendActionSay1,
  AssistantSendActionSay5,
  AssistantSendActionSay6,
} from './types/AssistantSendAction.d'

import {
  CHAR_SBER,
  CHAR_TIMEPARAMOY,
  Character,
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

export const NON_EXISTING_PAGE_NO = -1;
//export const HOME_PAGE_NO = 0;
//export const NAVIGATOR_PAGE_NO = 15;
//export const DASHBOARD_PAGE_NO = 16;
// export const SCHEDULE_PAGE_NO = 17;
export const CONTACTS_PAGE_NO = 18;
// export const FAQ_PAGE_NO = 19;
export const SETTING_PAGE_NO = 20;
export const LESSON_PAGE_NO = 21;

export const HOME_PAGE_ROUTE = "home";

const INITIAL_PAGE = 16;

const SEVEN_DAYS = 7 * MS_IN_DAY;
const FILL_DATA_TO_OPEN_TEXT = "Заполни данные, чтобы открывать расписание одной фразой";
const TO_VIEW_SET_GROUP_TEXT = "Чтобы посмотреть расписание, укажите данные учебной группы";

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({getState});
};

export const Spacer100 = styled.div`
  width: 100px;
  height: 100px;
`;

export const Spacer200 = styled.div`
  width: 200px;
  height: 200px;
`;

// const PAIR_NAME_IDX = 0;
// const TEACHER_NAME_IDX = 1;
// const PAIR_NO_IDX = 5;

const breaks = {
  '1': '09:00',
  '2': '10:35-10:50',
  '3': '12:25-12:40',
  '4': '14:15-14:30',
  '5': '16:05-16:20',
  '6': '17:55-18:10',
  '7': '19:45'
}

const daysOfWeekShort = [
  "Вс",
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
]

const dayNameDict = {
  "Пн": ["понедельник", 1],
  "Вт": ["вторник", 2],
  "Ср": ["среду", 3],
  "Чт": ["четверг", 4],
  "Пт": ["пятницу", 5],
  "Сб": ["субботу", 6]
}

/**
 * Порядковые числительные именительный падеж
 */
const ordinalNominativeCaseSingularFemDict = {
  "1": "первая",
  "2": "вторая",
  "3": "третья",
  "4": "четвертая",
  "5": "пятая",
  "6": "шестая",
  "7": "седьмая"
}

/**
 *
 */
const ordinalGenitiveCaseSingularFemDict = {
  1: "первой",
  2: "второй",
  3: "третьей",
  4: "четвертой",
  5: "пятой",
  6: "шестой",
  7: "седьмой"
}

/**
 *
 */
const numPron = {
  0: "ноль",
  1: "одна",
  2: "две",
  3: "три",
  4: "четыре",
  5: "пять",
  6: "шесть",
  7: "семь",
}

/**
 * Время начала и конца пар
 */

export interface StartEnd {
  start: string
  end: string
}

export interface ICheckIsCorrect{
  correct_sub: boolean
  correct_eng: boolean
  correct: boolean
}

const MAX_BELL_COUNT = 8;

const FIRST_DAY_OTHER_WEEK = 8;

export const LessonStartEnd: StartEnd[] = Array(MAX_BELL_COUNT).fill({start: "", end: ""})

/**
 *
 */
const TODAY_TOMORROW_DICT = {
  [DAY_TODAY]: 1,
  [DAY_TOMORROW]: 0,
}


export const NO_LESSONS_NAME = "Пар нет 🎉"

const DAYS_OF_WEEK_SHORT_RU = []

const DEFAULT_STATE_DAY: IDayHeader[] = [
  {
    title: 'Пн',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Вт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Ср',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Чт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Пт',
    date: ["", ""],
    count: [0, 0]
  }, {
    title: 'Сб',
    date: ["", ""],
    count: [0, 0]
  }
]


export type ThisOtherWeekBells = Bell[]
export type DayBells = ThisOtherWeekBells[]
export type IScheduleDays = DayBells[]

export const history = createBrowserHistory();




//

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
  day: IDayHeader[]
  days: IScheduleDays
  spinner: boolean
  date: number
  today: number
  theme: string
  dayPush: number
  isGroupError: boolean
  isActive: boolean
  subGroup: string
  teacher_id_bd: string
  group_id_bd: string
  eng_bd: string
  sub_bd: string
  isSubGroupError: boolean
  pushHour: number,
  pushMin: number,
  engGroup: string
  isEngGroupError: boolean
  isUser: boolean
  character: Character
    // todo paramoy
    | typeof CHAR_TIMEPARAMOY
  bd: string
  student: boolean
  teacher: string
  teacherId: string
  teacher_checked: boolean
  teacher_bd: string
  teacher_correct: boolean
  isTeacherError: boolean

  // building: IBuilding[]
}

export class App extends React.Component<IAppProps, IAppState> {
  _assistant

  constructor(props: IAppProps) {
    super(props);
    this.setValue = this.setValue.bind(this)
    this.Load_Schedule =  this.Load_Schedule.bind(this)
    this.CheckIsCorrect = this.CheckIsCorrect.bind(this)
    this.handleTeacherChange = this.handleTeacherChange.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    this.getCurrentLesson = this.getCurrentLesson.bind(this);
    this.NextWeek = this.NextWeek.bind(this);
    this.CurrentWeek = this.CurrentWeek.bind(this);
    this.PreviousWeek = this.PreviousWeek.bind(this);
    this.getIsCorrectTeacher = this.getIsCorrectTeacher.bind(this);
    this.Bd = this.Bd.bind(this);
    this.sendData = this.sendData.bind(this);
    this.ChangeTheme=this.ChangeTheme.bind(this);
    this.ChangePush=this.ChangePush.bind(this);
    this.Load_Schedule=this.Load_Schedule.bind(this);
    // this.tfRef                = React.createRef();
    console.log('constructor');
    history.push("/dashboard")
    // const bell = Array.from({length: 2}, (v, i) => Array.from({length: 8}, (v, i) => ""))
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
      day: DEFAULT_STATE_DAY,
      days: [],
      spinner: false,
      date: Date.now(),
      today: 0,
      theme: "dark",
      isGroupError: false,
      isTeacherError: false,
      isSubGroupError: false,
      isEngGroupError: false,
      isActive: false,
      pushHour: 0,
      pushMin: 0,
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

      // building: building,
    }
    

  }

  componentDidMount() {
    console.log('componentDidMount');

    this._assistant = initializeAssistant(() => this.getStateForAssistant());
    this._assistant.on("data", (event: AssistantEvent) => {
      console.log('_assistant.on("data") event:', event);

      switch (event?.type) {
        case "character":
          console.log('componentDidMount: character:', event.character.id);
          this.setState({character: event.character.id});
          if (event.character.id === CHAR_TIMEPARAMOY) {
            this.setState({description: FILL_DATA_TO_OPEN_TEXT});
          } else {
            this.setState({description: TO_VIEW_SET_GROUP_TEXT});
          }
          break;

        case "smart_app_data":
          console.log("User");
          console.log(event);
          if (event.sub !== undefined) {
            console.log("Sub", event.sub);
            this.setState({userId: event.sub});
            const now = new Date();
            this.setState({today: now.getDay()});
            getUser(this.state.userId).then((user)=> {

              if (user !== "0") {
                console.log('user', user)
                this.setState({groupId: user["group_id"], subGroup: user["subgroup_name"], engGroup: user["eng_group"], teacherId: user["teacher_id"], filialId: user["filial_id"]})
                getSchedulebyUserId(this.state.userId).then((response) => {
                  history.push("/dashboard")
                  this.setState({isActive: response.isActive, pushHour: response.hour, pushMin: response.minute})

                  console.log("getScheduleByUserId", response)
                    if (response.teacher_id != "" && response.teacher_id!=null) {
                      console.log(`${response.teacher_info.last_name} ${response.teacher_info.first_name}. ${response.teacher_info.mid_name}.`);
                      const teacher = `${response.teacher_info.last_name} ${response.teacher_info.first_name}. ${response.teacher_info.mid_name}.`;
                      this.setState({
                        student: false,
                        teacher_bd: teacher,
                        teacher_id_bd: response.teacher_id,
                        teacher_correct: true,
                        teacher: teacher,
                        isUser: true,
                      })


                    }else if (response.groupId != "")  {

                      this.setState({
                        group: response.groupName,
                        flag: true,
                        checked: true,
                        bd: response.groupName,
                        group_id_bd: this.state.groupId,
                        eng_bd: this.state.engGroup,
                        sub_bd: this.state.subGroup,
                        student: true,
                        isUser: true,
                      });
                      console.log(this.state.group_id_bd, "GROUP_ID_BD");
                    } else {
                      this.setState({isUser: true})
                      
                    }
                    if (this.state.teacherId != "" || this.state.group!= ""){
 
                    //Зачем два вызова?
                    this.SetWeekSchedule(response.schedule, 0);
                    this.SetWeekSchedule(response.schedule, 1);
                    }
                  })

              } else {
                console.log("first time")
                this.setState({isUser: true});
                history.push('/start')
                this.sendData({
                  action_id: "hello_phrase"
                })
                createUser(
                  this.state.userId,
                  this.state.filialId,
                  this.state.groupId,
                  this.state.subGroup,
                  this.state.engGroup,
                  this.state.teacherId,
                )
                }
              })
          }
          console.log(`assistant.on(data)`, event);
          const {action} = event;
          this.dispatchAssistantAction(action);
          break

        default:
          break
      }
    });
    this._assistant.on("start", (event) => {
      console.log(`_assistant.on(start)`, event);
    });
    this._assistant.on("ANSWER_TO_USER", (event) => {
      console.log(`_assistant.on(raw)`, event);
    });
  }

  TimуByLessonNum(num) {
    return LessonStartEnd[num].start + " - " + LessonStartEnd[num].end
  }

  setValue(key: string, value: any) {
    console.log(`setValue: key: ${key}, value:`, value);
    //console.log(this.state.group)
    switch (key) {
      case "group":
        this.setState({group: value});
        break;
      case "subGroup":
        this.setState({subGroup: value});
        break;
      case "teacher":
        this.setState({teacher: value});
        break;
      case "page":
        this.gotoPage(value);
        break;
      case "student":
        this.setState({student: value});
        break;
      case "teacher_checked":
        this.setState({teacher_checked: value});
        break;
      case "engGroup":
        this.setState({engGroup: value});
        break;
      case "checked":
        this.setState({checked: value});
        break;
      case "description":
        this.setState({description: value});
        break;
      case "bd":
        this.setState({bd: value});
        break;
      case "teacher_bd":
        this.setState({teacher_bd: value})
        break;
      case "flag":
        this.setState({flag: value})
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

  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(todayOrTomorrow: TodayOrTomorrow): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const weekDayIndex = this.state.today - dayShift;
    for (let bell in this.state.days[weekDayIndex]) {
      const lessonName = this.state.days[weekDayIndex][bell][THIS_WEEK].lessonName
      if (lessonName !== "") {
        return LessonStartEnd[Number(bell)].start
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(todayOrTomorrow: TodayOrTomorrow): string {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    console.log(`getEndLastLesson: todayOrTomorrow: ${todayOrTomorrow}, dayShift: ${dayShift}, dayNumber: ${dayNumber}`);
    let lessonEnd = '';
    for (let lessonIdx in this.state.days[dayNumber]) {
      if (this.state.days[dayNumber][lessonIdx][THIS_WEEK].lessonName !== "") {
        lessonEnd = LessonStartEnd[lessonIdx].end;
      }
    }
    return lessonEnd;
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(startOrEnd: StartOrEnd, todayOrTomorrow: TodayOrTomorrow, lessonNum: number): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    const lessonName = this.state.days[dayNumber][lessonNum - 1][THIS_WEEK].lessonName;

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
    todayOrTomorrow: TodayOrTomorrow,
    // todo: lessonNum строка или число ???
    lessonNum,
  ): string | [string, string] | undefined {
    if (todayOrTomorrow === DAY_TODAY && this.state.today === 0) {
      return [todayOrTomorrow, DAY_SUNDAY]

    } else if (todayOrTomorrow === DAY_TOMORROW && this.state.today === 6) {
      return [todayOrTomorrow, DAY_SUNDAY]

    } else if (startOrEnd === "start") {
      if (todayOrTomorrow === DAY_TODAY) {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(startOrEnd, todayOrTomorrow, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getStartFirstLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(startOrEnd, todayOrTomorrow, lessonNum)
        }
      }
    } else if (startOrEnd === "end") {
      if (todayOrTomorrow === DAY_TODAY) {
        if (lessonNum === "0") {
          return this.getEndLastLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(startOrEnd, todayOrTomorrow, lessonNum)
        }
      } else {
        if (lessonNum === "0") {
          return this.getEndLastLesson(todayOrTomorrow)
        } else {
          return this.getBordersRequestLesson(startOrEnd, todayOrTomorrow, lessonNum)
        }
      }
    }
  }


  /**
   * подсчет количества пар в указанную дату
   * возвращает массив с днем недели (Пн,Вт,...)
   * и количеством пар в этот день
   *
   * @param {Date} date
   * @returns {string}
   */
  getAmountOfLessons(date: Date): [string, number] | undefined {
    for (let day of this.state.day) {
      for (let week = 0; week < 2; week++) {
        console.log("this.getDateWithDots(date)", formatDateWithDots(date))
        console.log("day.date[week]", day.date[week])
        if (formatDateWithDots(date) === day.date[week]) {
          return [day.title, day.count[week]]
        }
      }
    }
    // if (res !== undefined) {return res}
    // else {return null}
  }

  /**
   * получить текущую пару
   *
   * @param date
   */
  getCurrentLesson(date: Date): string {
    if (this.state.today !== 0) {
      const todayIndex = this.state.today - 1
      const day = this.state.days[todayIndex]
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
      for (let bell in this.state.days[this.state.today - 1]) {
        if (
          formatTimeHhMm(date) < LessonStartEnd[Number(bell)].start &&
          LessonStartEnd[Number(bell)].start !== ""
        ) {
          countRemainingLessons += 1
        }
      }
    return countRemainingLessons
  }

  /**
   *
   * @param dayNumber
   * @returns {[
   *   string,   -- строка, содержащая начало пары
   *   string,   -- порядковый номер пары (1 символ)
   * ]}
   */
  getTimeFirstLesson(dayNumber: number): [string, string] {
    let lessonsStart = '';
    let lessonNumber = '';
    let week: THIS_OR_OTHER_WEEK = THIS_WEEK;
    if (dayNumber < this.state.today) {
      week = OTHER_WEEK;
    }
    for (let lessonIdx in this.state.days[dayNumber - 1]) {
      const lesson = this.state.days[dayNumber - 1][lessonIdx][week]
      if (lesson.lessonName !== "") {
        lessonsStart = LessonStartEnd[Number(lessonIdx)].start
        console.log(lessonIdx, "'lesson.lessonNumber'")
        lessonNumber = String(Number(lessonIdx)+1);
        break
      }
    }
    return [lessonsStart, lessonNumber];
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
    const todayWorkDayIndex = this.state.today - 1;
    const todayBells = this.state.day[todayWorkDayIndex]
    const todayLessons = this.state.days[todayWorkDayIndex]

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
      const firstLessonTimeHhMm = this.getTimeFirstLesson(todayWorkDayIndex + 1)[0].slice(0, 5);

      if (formatTimeHhMm(date) < firstLessonTimeHhMm) {
        console.log('formatTimeHhMm(date) < firstLessonTimeHhMm: true')
      }
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
        (this.getTimeFirstLesson(this.state.today)[0].slice(0, 5) !== undefined) &&
        (this.getTimeFirstLesson(this.state.today)[0].slice(0, 5) >= formatTimeHhMm(date))
      ) {
        const firstLessonInfo = this.getTimeFirstLesson(this.state.today)
        console.log('whatLesson:', firstLessonInfo[1]);

        const lessonNumber = parseInt(firstLessonInfo[1]);
        return {
          lesson: todayLessons[lessonNumber][0][0],
          type: "will",
          num: lessonNumber,
        }
      } else {
        for (let i in breaks) {
          const startTime = breaks[i].slice(0, 5);
          const endTime = breaks[i].slice(6);
          if (
            (
              formatTimeHhMm(date) > startTime &&
              formatTimeHhMm(date) < endTime
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
        const startTime = breaks[i].slice(0, 5);
        const endTime = breaks[i].slice(6);

        if (formatTimeHhMm(date) < breaks['1']) {
          numberNearestLesson = '1';
          break
        } else if (
          formatTimeHhMm(date) > startTime &&
          formatTimeHhMm(date) < endTime
        ) {
          numberNearestLesson = i;
          break
        } else if (formatTimeHhMm(date) > breaks['7']) {
          numberNearestLesson = null
        }
      }
      const amountOfLessons = this.getAmountOfLessons(date);
      if (amountOfLessons && amountOfLessons[1] === 0) {
        return {
          exist: "empty",
        }
      }
      if (numberNearestLesson !== undefined) {
        for (let bell in this.state.days[this.state.today - 1]) {
          // если пара с таким номером есть в расписании
          if (this.state.days[this.state.today - 1][bell][THIS_WEEK].lessonNumber === numberNearestLesson) {
            return {
              audience: this.state.days[this.state.today - 1][bell][THIS_WEEK].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.state.days[this.state.today - 1]) {
              if (this.state.days[this.state.today - 1][bell][THIS_WEEK].lessonNumber !== numberNearestLesson) {
                return {
                  audience: this.state.days[this.state.today - 1][bell][THIS_WEEK].room,
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
        for (let bell in this.state.days[this.state.today - 1]) {
          if (this.state.days[this.state.today - 1][bell][THIS_WEEK].lessonNumber === this.getCurrentLesson(date)) {
            whereCurrentLesson = this.state.days[this.state.today - 1][bell][THIS_WEEK].room
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
        for (let bell in this.state.days[this.state.today - 1]) {
          if (this.state.days[this.state.today - 1][bell][THIS_WEEK].lessonNumber === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = this.state.days[this.state.today - 1][bell][THIS_WEEK].room
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

  sendData(action: AssistantSendAction) {
    console.log(action);
    return this._assistant.sendData({
      action
    })
  }

  async dispatchAssistantAction(action: AssistantAction) {
    console.log("dispathcAction:", action)
    if (action) {
      switch (action.type) {
        case 'settings':
          console.log("PUSH");
          break;
        case 'profile':
          console.log("profile");
          // if(! action.IsStudent){
          //   this.setState({student: false})
          // }
          // else{
          //   this.setState({student: true})
          // }
          return history.push("/home")
          break;
        case 'set_eng_group':
          console.log("Pathname:",history.pathname)
          if( action.group!=undefined){
            this.setState({engGroup: String(action.group) })
          }
          break

        case 'for_today':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today === 0) {

              this.sendData({
                action_id: "todaySchedule",
                parameters: {
                  day: DAY_SUNDAY
                },
              })
              return this.ChangeDay(7);

            } else {
              this.sendData({
                action_id: "todaySchedule",
                parameters: {day: DAY_NOT_SUNDAY},
              })
              return this.ChangeDay(this.state.today);
            }
          break;

        case 'for_tomorrow':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today + 1 === 7) {
              this.sendData({
                action_id: "tomorrowSchedule",
                parameters: {day: DAY_SUNDAY},
              })
              return this.ChangeDay(7);
            } else {
              this.sendData({
                action_id: "tomorrowSchedule",
                parameters: {day: DAY_NOT_SUNDAY},
              })
              return this.ChangeDay(this.state.today + 1);
            }
          break;

        case 'for_next_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.NextWeek();
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

            const [type, day, lessonNum] = action.note || [];

            let answer = this.getStartEndLesson(type, day, lessonNum)
            // const [ type, day ] = this.getStartEndLesson(type, day, lessonNum)


            console.log("answer", answer)
            if (answer !== undefined && answer[1] === DAY_SUNDAY) {
              params = {
                type: answer[0],
                day: answer[1],
              }
            } else {
              params = {
                type: type,
                day: day,
                ordinal: ordinalNominativeCaseSingularFemDict[lessonNum],
                time: answer
              }
            }
            this.sendData({
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
          let countOfLessons: [string, number] | undefined;
          let day: TodayOrTomorrow | undefined;
          let page = 0;
          console.log("how many. group:", this.state.group, ", teacher:", this.state.teacher)
          if ((this.state.group !== "") || (this.state.teacher !== "")) {

            if (action.note !== undefined) {

              const {timestamp, dayOfWeek} = action.note;
              console.log(timestamp, this.getAmountOfLessons(new Date(timestamp)), "how many")

              countOfLessons = this.getAmountOfLessons(new Date(timestamp))

              // todo: упростить
              if (String(this.state.today + 1) === dayOfWeek) {
                day = DAY_TODAY;
                page = 0
              } else if (String(this.state.today + 2) === dayOfWeek) {
                day = DAY_TOMORROW;
                page = 0
              } else { // fallback
                day = undefined
                page = 0
              }
            } else {
              countOfLessons = this.getAmountOfLessons(new Date(Date.now()))
              day = DAY_TODAY
            }

            let howManyParams: AssistantSendActionSay1['parameters'] = {
              day: DAY_SUNDAY,
            };

            if (this.state.group !== "" && countOfLessons !== undefined) {
              const [dayOfWeek, pairCount] = countOfLessons;

              const pairText = pairNumberToPairText(pairCount);

              const [inDayOfWeek, dayOfWeekIndex] = dayNameDict[dayOfWeek]
              howManyParams = {
                lesson: pairText,
                day: day,
                dayName: inDayOfWeek,
                amount: numPron[pairCount]
              }
              if (dayOfWeekIndex < this.state.today) {
                page = 7;
              }
              this.ChangeDay(dayOfWeekIndex + page)
            }

            this.sendData({
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
                pron: numPron[amountOfRemainingLessons]
              }
            }
            this.sendData({
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
          console.log('ok')
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = {
                "when": "now",
              }
            }
            const whereLessonParams = this.whereWillLesson(new Date(this.state.date), action.note.when)
            this.sendData({
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
          console.log("what_lesson: какая пара")
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (!action.note) {
              action.note = {
                "when": "now",
              }
            }
            const whatlesson = this.whatLesson(new Date(), action.note.when);
            console.log('what_lesson: whatlesson:', whatlesson)
            this.sendData({
              action_id: "say4",
              parameters: whatlesson,
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
              const {dayOfWeek: strDayOfWeek} = action.note;
              const numDayOfWeek = parseInt(strDayOfWeek) - 1
              console.log('dispatchAssistantAction: first_lesson:', action.note)
              console.log('dispatchAssistantAction: first_lesson:', numDayOfWeek);
              firstLessonNumStr = this.getTimeFirstLesson(numDayOfWeek)[1]
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
              firstLessonNumStr = this.getTimeFirstLesson(0)[1];
              // day = DAY_TODAY
              day1 = undefined
            }
            let whichFirst: AssistantSendActionSay5['parameters'] = {
              day1: DAY_SUNDAY,
            }
            if (firstLessonNumStr !== undefined) {
              const {dayOfWeek: strDayOfWeek} = action.note;
              const dayOfWeekIdx = parseInt(strDayOfWeek) - 1
              const dayOfWeekShortName = daysOfWeekShort[dayOfWeekIdx];

              const [inDayOfWeek, dayOfWeekIdx1] = dayNameDict[dayOfWeekShortName];

              whichFirst = {
                num: ordinalGenitiveCaseSingularFemDict[firstLessonNumStr/*[0]*/],
                day: day1,
                dayName: inDayOfWeek
              }
              console.log(whichFirst)
              if (dayOfWeekIdx1 < this.state.today) {
                page1 = 7;
              }

              const newPage = dayOfWeekIdx1 + page1;
              this.gotoPage(newPage)
            }
            this.sendData({
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
                console.log(this.state.flag);
                page2 = 7;
              } else {
                page2 = 0;
              }

            } else {
              console.log(action.note)
              console.log(parseInt(action.note[0].dayOfWeek) - 1);
              if (action.note[1] !== null) {
                console.log(action.note[1]);
                page2 = 0;
              } else if (action.note[2] !== null) {
                console.log(action.note[2]);
                page2 = 7;
              }
            }

            let daySchedule: AssistantSendActionSay6['parameters'];
            // if (this.state.group !== "") {
            const {dayOfWeek: strDayOfWeek} = action.note[0];
            const dayOfWeekIdx = parseInt(strDayOfWeek) - 1;
            console.log(dayOfWeekIdx, "day")
            const [dayOfWeekNameLong, dayOfWeekIdx1] = dayNameDict[this.state.day[dayOfWeekIdx - 1].title];

            daySchedule = {
              dayName: dayOfWeekNameLong,
            }

            const newPage = dayOfWeekIdx1 + page2;
            this.gotoPage(newPage)
            // }
            this.sendData({
              action_id: "say6",
              parameters: daySchedule,
            })
          }
          break

        case 'show_schedule':
          console.log("show schedule");
          if(action.note!=undefined && action.note!=""){
            let IsStudent = true
            if (action.note.includes("препод")){
              IsStudent = false
            }
            //this.gotoPage(HOME_PAGE_NO);
            this.sendData({
              action_id: "change_group",
              parameters: {
                IsStudent: IsStudent
              }
            })
          }
          else{
            if(history.location == HOME_PAGE_ROUTE){
              if(this.state.student){
                let isCorrect = await this.CheckIsCorrect()
                if(isCorrect){
                  await this.Load_Schedule()
                  history.push('/spinner')
                 }
              }
              else{
                this.handleTeacherChange(true).then(async(response)=>{
                  if(response){
                    await this.Load_Schedule()
                    history.push('/spinner')
                  }
                })
              }
            }
            else{
              await this.Load_Schedule();
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
          return;
        case 'contacts':
          history.push('/contacts')
          return;
        case 'group':
          console.log("Assistant: group")
          if (action.note[0] === 0) {
            console.log(action.note[1].data.groupName[0]);
            this.setState({
              group: action.note[1].data.groupName[0].toUpperCase(),
            });
            //history.push('/home')
          } else {
            console.log(action.note[1].data.groupName[1])
            this.setState({
              group: action.note[1].data.groupName[1].toUpperCase(),
            })
            //history.push("/home")
          }
          break
        case 'dashboard':
          history.push("/dashboard")
          break;

        case 'subgroup':
          this.setState({subGroup: action.note});
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
          ({id, title}, index) => ({
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

  async convertIdInGroupName(): Promise<void> {
    console.log(this.state.groupId);
    let group = await getGroupById(Number(this.state.groupId))
    this.setState({group: group.name})
  }

  protected isTeacher() {
    return !this.state.student && this.state.teacher_correct
  }

  // получить дату первого дня недели
  getFirstDayWeek(date: Date): string {
    // номер дня недели
    const now = new Date();
    this.setState({today: now.getDay()});

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

  //Загружает расписание с бекенда
  async getScheduleFromDb(date: number) {
    const firstDayWeek = this.getFirstDayWeek(new Date(date));
    if (this.isTeacher()) {
      await getScheduleTeacherFromDb(
        this.state.teacherId,
        firstDayWeek
      ).then((response) => {
        this.SetWeekSchedule(response, 1);
      })
    } else {
      await getScheduleFromDb(
        this.state.groupId,
        this.state.engGroup,
        firstDayWeek
      ).then((response) => {
        this.SetWeekSchedule(response, 1);
      })
    }
    this.setState({date: date, flag: true});
  }

  /**
   * Заполнение расписанием на следующую неделю
   */
  async NextWeek() {
    this.setState({spinner: false});
    const datePlusWeek = this.state.date + SEVEN_DAYS;
    return this.getScheduleFromDb(datePlusWeek);
  }

  async CurrentWeek() {
    return this.getScheduleFromDb(Date.now());
  }

  /**
   * Заполнение расписанием на предыдущую неделю
   */
  async PreviousWeek() {
    this.setState({spinner: false});
    const dateMinusWeek = this.state.date - SEVEN_DAYS;
    return this.getScheduleFromDb(dateMinusWeek);
  }

  /**
   * заполнение данными расписания из бд
   */
SetWeekSchedule(parsedSchedule: IScheduleApiData, i) {
  console.log("ParsedSchedule", parsedSchedule)
    console.log("scheduleData", parsedSchedule)
    console.log('showWeekSchedule')
    this.setState({spinner: false});

    let days;
    /*
    При первой загрузке this.state.days равен [] 
    и его надо инициализировать
    */
    if (this.state.days.length == 0) {
      days = new Array(7).fill([]);
      for (let day in days) {
        days[day] = Array(7).fill([])
        for (let bell in days[day]) {
          days[day][bell] = [new Bell(), new Bell()];
        }
      }
    } else {
      days = this.state.days
      for (let day in days) {
        for (let bell in days[day]) {
          days[day][bell][i].lessonName = "";
          days[day][bell][i].teacher = "";
          days[day][bell][i].room = "";
          days[day][bell][i].lessonType = "";
          days[day][bell][i].lessonNumber = "";
          days[day][bell][i].url = "";
          days[day][bell][i].groupNumber = "";
        }
      }
    }

    for (let day_num = 1; day_num < 7; day_num++) {

      // todo
      let countLessons = 0;
      this.state.day[day_num - 1].count[i] = 0;

      if (parsedSchedule.schedule !== null) {
        this.state.day[day_num - 1].date[i] = parsedSchedule.schedule_header[`day_${day_num}`].date;
        for (let bell in parsedSchedule.schedule) { //проверка
          let bell_num = Number(bell.slice(-1)) - 1
          let lesson_info: IScheduleLessonInfo = parsedSchedule.schedule[bell][`day_${day_num}`].lessons[0]
          let lesson_info_state: Bell = days[day_num - 1][bell_num][i]

          const subgroup_name = lesson_info?.groups?.[0]?.subgroup_name;

          let header = parsedSchedule.schedule[bell]['header']
          LessonStartEnd[bell_num] = {start: header['start_lesson'], end: header['end_lesson']}

          if (
            (parsedSchedule.schedule[bell_num] !== undefined) &&
            (lesson_info !== undefined) &&
            (subgroup_name !== undefined) &&
            (subgroup_name === this.state.subGroup) &&
            (this.state.subGroup !== "")
          ) {

            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = bell.slice(5, 6);
            lesson_info_state.url = lesson_info.other;
            countLessons++;
            this.state.day[day_num - 1].count[i]++;

          } else if (
            (parsedSchedule.schedule[bell] !== undefined) &&
            (lesson_info !== undefined) &&
            (subgroup_name !== undefined) &&
            (subgroup_name !== this.state.subGroup) &&
            (this.state.subGroup !== "")
          ) {
            lesson_info_state.reset()

          } else if (
            (parsedSchedule.schedule[bell] !== undefined) &&
            (lesson_info !== undefined)
          ) {
            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = bell.slice(5, 6);
            lesson_info_state.url = lesson_info.other;

            for (let name in lesson_info.groups) {
              lesson_info_state.groupNumber += `${lesson_info.groups[name].name} `;
            }
            countLessons++;
            this.state.day[day_num - 1].count[i]++;

          } else {
            lesson_info_state.reset();
          }
        }
        if (this.state.day[day_num - 1].count[i] === 0)
          days[day_num - 1][0][i].lessonName = NO_LESSONS_NAME;

      } else {
        days[day_num - 1][0][i].lessonName = NO_LESSONS_NAME;
      }

    }
    this.setState({spinner: true});
    this.setState({days: days});
    console.log("Days", days, "Day", this.state.day)
  }

  ChangeDay(day: number): void{
    this.ChangePage();
    this.gotoPage(day);
  }


  ChangePage() {

    console.log("LOCATION:",history.location)
    let timeParam = this.state.page;
    if ('/spinner'== history.location) {
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
      this.setState({flag: false});
    } else {
      this.setState({flag: true});
    }
  }

  ChangeTheme(){
    console.log(this.state.theme, "THEME")
    if (this.state.theme=="dark")
    this.setState({theme: "light"})
    else this.setState({theme: "dark"})
  }

  doSetTeacher(teacherName: string): void {
    this.setState({teacher: teacherName}, async () => {
      await this.handleTeacherChange(false);
    });
  }

  // todo исправить асинхронную работу
  async handleTeacherChange(isSave: boolean): Promise<boolean> {
    console.log('handleTeacherChange: this.state.teacher:', this.state.teacher)

    await getIdTeacherFromDb(this.state.teacher).then((teacherData) => {
      console.log('handleTeacherChange:', teacherData);
      console.log('handleTeacherChange: status:', teacherData.status);

      if (
        (teacherData.status == "-1") ||
        (teacherData.status == "-2")
      ) {
        console.log("handleTeacherChange: teacherData.status:", teacherData.status);
        this.setState({
          isTeacherError: true})
          return true

      } else
        getScheduleTeacherFromDb(
          teacherData.id,
          this.getFirstDayWeek(new Date())
        ).then((response) => {
          console.log("Teahcer Shcedule", response)
          this.SetWeekSchedule(response, 0);
        });

        const formatTeacherName = (teacherData: ITeacherApiData) => (
          `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`
        )

        getInTeacherFromDb(teacherData.id).then((parsedTeacher2) => {
          this.setState({
            teacher: formatTeacherName(teacherData)
          })
        })

         this.setState({
          teacherId: teacherData.id,
          //
          teacher_correct: true,

          date: Date.now(),
          flag: true,
          student: false,
          isTeacherError: false,
        });
        history.push('/spinner')

      if (isSave) {
        this.setState({teacher_bd: this.state.teacher, teacher_id_bd: this.state.teacherId})
        createUser(
          this.state.userId,
          filial.id,
          this.state.groupId,
          this.state.subGroup,
          this.state.engGroup,
          this.state.teacherId,
        );
      }
      return false
    })
    return false
  }


  async _loadSchedule({ groupId, engGroup }: { groupId: string, engGroup: string }): Promise<void> {
    console.log('LOAD_SCHEDULE:', groupId, engGroup)
    await getScheduleFromDb(
      groupId,
      String(engGroup),
      this.getFirstDayWeek(new Date())
    )
      .then((response) => {
        console.log("LOAD_SCHEDULE_THEN")
        this.SetWeekSchedule(response, 0);
        console.log('_loadSchedule:', String(this.state.engGroup), this.state.groupId);
        console.log("RESPONSE", response)
        this.setState({
          flag: true,
          isGroupError: false,
          teacher_bd: ""
        });
      })
  }
  
  async Load_Schedule(): Promise<void> {
    return await this._loadSchedule({
      groupId: this.state.groupId,
      engGroup: String(this.state.engGroup),
  });
  }

  //Проверяет правильность ввода данных студента
  async CheckIsCorrect() : Promise<boolean>{
    console.log('App: isCorrect')
    this.setState({correct: false, date: Date.now(), flag: true});
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
          this.setState({group: group.name, groupId: group.id})
          correct = true;
        }
        console.log(this.state.groupId, "group Id");
        if (english_response || this.state.engGroup == "") {
          correct_eng = true;
          console.log(`App: isCorrect: correct_eng: ${correct_eng}`);
        }
        if ((this.state.subGroup === "") || (this.state.subGroup === "1") || (this.state.subGroup === "2")) {
          correct_sub = true;
        }
        this.setState({isEngGroupError: !correct_eng, isSubGroupError:!correct_sub, isGroupError: !correct})
        const groupId = String(group.id);
        let isCorrect = correct_eng && correct_sub && correct
        if(isCorrect){
          console.log("create_user")
          this.setState({groupId: groupId, group: group.name, bd: this.state.group, correct: true, group_id_bd: groupId, eng_bd: this.state.engGroup, sub_bd: this.state.subGroup, teacher_id_bd: ""}, () => {
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

  async Bd(): Promise<void> {
    console.log("BD")
    if (this.state.teacher_bd != "") {
      
      this.setState({student: false, spinner: false})
      await getScheduleTeacherFromDb(
        this.state.teacher_id_bd,
        this.getFirstDayWeek(new Date())
      ).then((response) => {
        console.log('Bd: getScheduleTeacherFromDb: response:', response)
        this.SetWeekSchedule(response, 0);
      });
    } else {
      console.log('Bd: getScheduleFromDb: this.state.group_id_bd:', this.state.group_id_bd);
      this.setState({
        groupId: this.state.group_id_bd,
        group: this.state.bd,
        student: true,
        spinner: false,
        engGroup: this.state.eng_bd,
        subGroup: this.state.sub_bd
      });
      await this._loadSchedule({
        groupId: this.state.group_id_bd,
        engGroup: this.state.eng_bd,
      });
    }
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

  ChangePush(hour: number, min: number, isActive: boolean){
    this.setState({pushHour: hour, pushMin: min, isActive: isActive});
  }

  gotoPage(pageNo: number): void {
    console.log('App: gotoPage:', pageNo);
    // temporary workaround
    history.push('/');
    this.setState({page: pageNo});
  }

  render() {
    let {page} = this.state;
    // console.log("App: render, this.state:", this.state)
    return (
      <Router history={history}>
        <Switch>
          <Route
            path="/contacts"
            render={
              ({match}) => {
                return <Contacts
                  character={this.state.character}
                  theme={this.state.theme}
                  onDashboardClick={()=>{history.push("/dashboard")}}
                />
              }
            }
          />
          <Route
            path="/faq"
            render={
              ({match}) => {
                return <FAQ
                  character={this.state.character}
                  theme={this.state.theme}
                  onDashboardClick={()=>{history.push("/dashboard")}}
                />
              }
            }
          />
          <Route
            path="/navigation"
            render={
              ({match}) => {
                return <NavigatorPage
                  buildings={buildings}
                  character={this.state.character}
                  theme={this.state.theme}
                  isMobileDevice={detectDevice() === "mobile"}
                  onDashboardClick={()=>{history.push("/dashboard")}}
                  onHomeClick={() => {history.push("/home")}}
                  onScheduleClick={() => { history.push('/spinner')}}
                />
              }
            }
          />
          <Route
            path="/settings"
            // component={
            render={
              ({match}) => {
                return <Settings
                  userId={this.state.userId}
                  bd={this.state.bd}
                  sendData={this.sendData}
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
                  ChangePush={this.ChangePush}
                  isGroupError={this.state.isGroupError}
                  isActive={this.state.isActive}
                  pushHour={this.state.pushHour}
                  pushMin={this.state.pushMin}
                  subGroup={this.state.subGroup}
                  dayPush={this.state.dayPush}
                  isSubGroupError={this.state.isSubGroupError}
                  CheckIsCorrect={this.CheckIsCorrect}
                  engGroup={this.state.engGroup}
                  isEngGroupError={this.state.isEngGroupError}
                  LoadSchedule = { this.Load_Schedule}
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
            path="/lesson/:lessonIndex"
            render={
              ({match}) => {
                // temporary workaround
                console.log("/lesson/...: this.state.page:", this.state.page)
                // if (this.state.page!==NON_EXISTING_PAGE_NO) this.gotoPage(NON_EXISTING_PAGE_NO);
                return (
                  <Lesson
                    character={this.state.character}
                    isTeacherAndValid={this.getIsCorrectTeacher()}
                    spinner={this.state.spinner}
                    theme={this.state.theme}
                    currentLesson={this.state.days[this.state.page-1]?.[match.params.lessonIndex-1]?.[THIS_WEEK]}
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
              ({match}) =>{
                const now = new Date();
                
                let todayIndex = this.state.today - 1;

                let currentLessonIdx = this.getCurrentLesson(now);
                let currentLesson = this.state.days[todayIndex]?.[parseInt(currentLessonIdx) - 1]?.[THIS_WEEK];
                let currentLessonStartEnd = LessonStartEnd[parseInt(currentLessonIdx) - 1]

                let nextLessonIdx = this.whatLesson(now, "will").num;
                let nextLesson = this.state.days[todayIndex]?.[nextLessonIdx - 1]?.[THIS_WEEK];
                //console.log(this.whatLesson(now, "will").num, "next")
                let count = this.state.day[this.state.today - 1]?.count[0]
                //console.log("COUNT", this.state.today)
                let nextLessonStartEnd = LessonStartEnd[nextLessonIdx-1];
                let start = this.getTimeFirstLesson(todayIndex + 1)[0].slice(0, 5);
                let end = this.getEndLastLesson(DAY_TODAY);
                return <DashboardPage
                  character={this.state.character}
                  theme={this.state.theme}
                  isTeacherAndValid={this.getIsCorrectTeacher()}
                  isUser={this.state.isUser}
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
                  
                />
              }
            }/>
          <Route 
          path="/home"
          render={
            ({match}) =>{
              return <HomePage
                // state={this.state}
                CheckIsCorrect={this.CheckIsCorrect}
                LoadSchedule = { this.Load_Schedule}
                onHandleTeacherChange={this.handleTeacherChange}
                onConvertIdInGroupName={this.convertIdInGroupName}
                onSetValue={this.setValue}
                description={this.state.description}
                character={this.state.character}
                theme={this.state.theme}
                checked={this.state.checked}
                onShowScheduleClick={()=>{ history.push('/spinner')}}
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
          render ={
            ({match}) =>{
              <Start
                character={this.state.character}
                theme={this.state.theme}
                isMobileDevice={detectDevice() === "mobile"}
                onDashboardClick={() => history.push("/dashboard")}
              />
            }
          }
          />
          <Route
          path="/spinner"
          render ={
            ({match}) =>{
              this.Spinner()
            }
          }
          />
          <Route path="*">
            {

              (page >= 1 && page <= 13) &&
              <Schedule
                timeParam={page}
                onSetValue={this.setValue}
                teacher={this.state.teacher}
                groupName={this.state.group}
                character={this.state.character}
                theme={this.state.theme}
                isTeacher={!this.state.student}
                Bd={this.Bd}
                bd={this.state.bd}
                teacher_bd={this.state.teacher_bd}
                PreviousWeek={this.PreviousWeek}
                CurrentWeek={this.CurrentWeek}
                NextWeek={this.NextWeek}
                getCurrentLesson={this.getCurrentLesson}
                doSetTeacher={(teacherName: string) => this.doSetTeacher(teacherName)}
                weekParam={page > 7 ? 1 : 0}
                day={this.state.day}
                spinner={this.state.spinner}
                today={this.state.today}
                days={this.state.days}
                group={this.state.group}
                subGroup={this.state.subGroup}
                getIsCorrectTeacher={this.getIsCorrectTeacher}
              />
            }
            {
              <div></div>
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}