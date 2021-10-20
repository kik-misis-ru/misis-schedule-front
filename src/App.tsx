import {createAssistant, createSmartappDebugger,} from "@sberdevices/assistant-client";
import {Container, DeviceThemeProvider, Spinner,} from '@sberdevices/plasma-ui';
import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";

import {
  createUser,
  getIdTeacherFromDb,
  getInTeacherFromDb,
  getScheduleFromDb,
  getScheduleTeacherFromDb,
  getUser,
  IScheduleApiData,
  IScheduleLessonInfo,
} from "./APIHelper";
import {ACCENT_TEXT_COLOR, DEFAULT_TEXT_COLOR,} from './components/consts';

import Dashboard from './components/Dashboard';

import HomeView from './components/HomeView';
import Navigator from './components/Navigator';
import ScheduleDayFull from "./components/ScheduleDayFull";
import TopMenu from './components/TopMenu/';
import WeekCarousel from "./components/WeekCarousel";
import WeekSelect from "./components/WeekSelect";
import building from './data/buldings.json'
import engGroups from './data/engGroups.json'

import groups from './groups_list.json';
import {Bell} from './ScheduleStructure'

import "./themes/App.css";
import {DocStyle, getThemeBackgroundByChar} from "./themes/tools";
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
import {formatDateWithDashes, formatDateWithDots, MS_IN_DAY, pairNumberToPairText} from './utils';

export const HOME_PAGE_NO = 0;
export const NAVIGATOR_PAGE_NO = 15;
export const DASHBOARD_PAGE_NO = 16;

const INITIAL_PAGE = 7;

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

export const MyDiv100 = styled.div`
  width: 100px;
  height: 100px;
`;

export const MyDiv200 = styled.div`
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

const dayNameDict = {
  "Пн": ["В понедельник", 1],
  "Вт": ["Во вторник", 2],
  "Ср": ["В среду", 3],
  "Чт": ["В четверг", 4],
  "Пт": ["В пятницу", 5],
  "Сб": ["В субботу", 6]
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
 *
 */
const TODAY_TOMORROW_DICT = {
  [DAY_TODAY]: 1,
  [DAY_TOMORROW]: 0,
}



const COLOR_NAME_ERROR = 'error'
const COLOR_NAME_WARN_RU = 'Предупреждение'

const NO_LESSONS_NAME = "Пар нет 🎉"

const DAYS_OF_WEEK_SHORT_RU = [

]

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


interface IBuilding {
  name: string
  address: string
  color: string
  short: string
}

export type IScheduleDays = Bell[][][]

//

interface IAppProps {
}

interface IAppState {
  notes: { id: string, title: string }[];
  userId: string
  page: number
  // logo
  flag: boolean
  checked: boolean
  description: string
  group: string
  groupId: string
  subGroup: string
  engGroup: string
  correct
  i: number
  day: IDayHeader[]
  days: IScheduleDays
  spinner: boolean
  date: number
  today: number
  color_group: string
  color_teacher: string
  color_sub: string
  color_enggroup?: string
  character: Character
    | typeof CHAR_TIMEPARAMOY
  star: boolean
  bd: string
  student: boolean
  teacher: string
  teacherId: string
  teacher_checked: boolean
  teacher_star: boolean
  teacher_bd: string
  teacher_correct: boolean
  building: IBuilding[]
}

export class App extends React.Component<IAppProps, IAppState> {
  _assistant

  constructor(props: IAppProps) {
    super(props);
    this.setValue = this.setValue.bind(this)
    this.isCorrect = this.isCorrect.bind(this)
    this.isCorrectTeacher = this.isCorrectTeacher.bind(this)
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
    // this.tfRef                = React.createRef();
    console.log('constructor');
    // const bell = Array.from({length: 2}, (v, i) => Array.from({length: 8}, (v, i) => ""))
    this.state = {
      notes: [],
      //
      userId: "",
      //
      page: INITIAL_PAGE,
      // logo: null,
      flag: true,
      checked: true,
      description: "",
      group: "",
      groupId: "",
      subGroup: "",
      engGroup: "",
      correct: null,
      i: 0,
      day: DEFAULT_STATE_DAY,
      days: [],
      spinner: false,
      date: Date.now(),
      today: 0,
      color_group: DEFAULT_TEXT_COLOR,
      color_teacher: DEFAULT_TEXT_COLOR,
      color_sub: DEFAULT_TEXT_COLOR,
      character: CHAR_SBER,
      star: false,
      bd: "",
      student: true,
      teacher: "",
      teacherId: "",
      teacher_checked: false,
      teacher_star: false,
      teacher_bd: "",
      teacher_correct: false,
      building: building,
    }
    // this.Home                 = Home.bind(this);
    // this.Navigator            = Navigator.bind(this);
    this.Raspisanie = this.Raspisanie.bind(this);
    this.convertIdInGroupName = this.convertIdInGroupName.bind(this);
  }

  componentDidMount() {
    console.log('componentDidMount');

    this._assistant = initializeAssistant(() => this.getStateForAssistant());
    this._assistant.on("data", (event: AssistantEvent) => {
      switch (event.type) {

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
            getUser(this.state.userId).then((user) => {

              if (user !== "0") {
                console.log('user', user)
                this.setState({
                  groupId: user.group_id,
                  subGroup: user.subgroup_name,
                  engGroup: user.eng_group,
                  teacherId: user.teacher_id,
                })
                this.convertIdInGroupName()
                if (this.state.teacherId !== "") {
                  getInTeacherFromDb(this.state.teacherId)
                    .then((teacherData) => {
                        const teacher = `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`;
                        this.setState({
                          teacher
                        })
                      }
                    );
                  getScheduleTeacherFromDb(
                    this.state.teacherId,
                    this.getFirstDayWeek(new Date(this.state.date))
                  )
                    .then((response) => {
                      this.showWeekSchedule(response, 0)
                    });
                  this.ChangePage()
                  this.setState({
                    student: false,
                    page: 17,
                    teacher_checked: true,
                    teacher_star: true,
                    teacher_bd: this.state.teacherId,
                    teacher_correct: true
                  });
                } else if (this.state.groupId !== "") {
                  getScheduleFromDb(this.state.groupId, this.state.engGroup, this.getFirstDayWeek(new Date(this.state.date))).then((response) => {
                    this.showWeekSchedule(response, 0)
                  });
                  this.ChangePage()
                  this.setState({page: 17, checked: true, star: true, bd: this.state.groupId, student: true});
                } else {
                  this.ChangePage()
                  this.setState({page: HOME_PAGE_NO});
                }
              } else {
                this.ChangePage()
                this.setState({page: HOME_PAGE_NO});
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

  setValue(key: string, value: any) {
    console.log(key, value)
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
        this.ChangePage()
        this.setState({page: value});
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
      default:
        break;
    }
  }

  // определяет когда начинаются пары сегодня или завтра
  getStartFirstLesson(todayOrTomorrow: TodayOrTomorrow): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    for (let bell in this.state.days[dayNumber]) {
      const startAndFinishTime = this.state.days[dayNumber][bell][0].startAndFinishTime
      if (startAndFinishTime !== "") {
        return startAndFinishTime.slice(0, 5)
      }
    }
  }

  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(todayOrTomorrow: TodayOrTomorrow): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    for (let bell = 7; bell > 0; bell--) {
      const startAndfinishTime = this.state.days[dayNumber][bell - 1][0].startAndFinishTime
      if (startAndfinishTime !== "") {
        return startAndfinishTime.slice(8)
      }
    }
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(startOrEnd: StartOrEnd, todayOrTomorrow: TodayOrTomorrow, lessonNum: number): string | undefined {
    const dayShift = TODAY_TOMORROW_DICT[todayOrTomorrow]
    const dayNumber = this.state.today - dayShift;
    const startAndFinishTime = this.state.days[dayNumber][lessonNum - 1][0].startAndFinishTime;

    if (startAndFinishTime !== "") {
      if (startOrEnd === "start") {
        return startAndFinishTime.slice(0, 5)
      } else {
        return startAndFinishTime.slice(8)
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
   * возвращает массив с днем недели и количеством пар в этот день
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
   * получить текущее время в формате "HH:MM"
   *
   * @param {Date} date
   * @returns {string}
   */
  getTime(date: Date): string {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${(hours < 10 ? '0' : '').concat('' + hours)}:${(minutes < 10 ? '0' : '').concat('' + minutes)}`
  }

  /**
   * получить текущую пару
   *
   * @param date
   */
  getCurrentLesson(date: Date): string | undefined {
    if (this.state.today !== 0) {
      const day = this.state.days[this.state.today - 1]
      for (let bellIdx in day) {
        const lesson = this.state.days[this.state.today - 1][bellIdx][0];
        if (
          // todo: почему (0, 6) ???
          (this.getTime(date) > lesson.startAndFinishTime.slice(0, 6)) &&
          (this.getTime(date) < lesson.startAndFinishTime.slice(8)) &&
          (lesson.startAndFinishTime.slice(0, 6) !== "")
        ) {
          return lesson.lessonNumber[0]
        }
      }
    }
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
          this.getTime(date) < this.state.days[this.state.today - 1][bell][0].startAndFinishTime.slice(0, 6) &&
          this.state.days[this.state.today - 1][bell][0].startAndFinishTime.slice(0, 6) !== ""
        ) {
          countRemainingLessons += 1
        }
      }
    return countRemainingLessons
  }

  /**
   *
   * @param daynum
   * @returns {[
   *   string,   -- строка, содержащая начало и конец пары
   *   string,   -- порядковый номер пары (1 символ)
   * ]}
   */
  getTimeFirstLesson(daynum: number): [string, string] {
    let first = '';
    let num = '';
    let week = 0;
    if (daynum < this.state.today) {
      week = 1;
    }
    for (let bellIdx in this.state.days[daynum - 1]) {
      const bell = this.state.days[daynum - 1][bellIdx][week]
      if (bell[5] !== "") {
        first = bell.startAndFinishTime;
        num = bell.lessonNumber[0];
        break
      }
    }
    return [first, num];
  }

  whatLesson(
    date: Date,
    when: NowOrWill,
  ): {
    lesson: string | undefined,
    type: NowOrWill | 'next',
    num: number | undefined,
  } { //определяет название пары, которая идет или будет
    // ключ - номер пары, значение - перерыв до этой пары

    if (this.state.today == 0) {
      return {
        lesson: undefined,
        type: when,
        num: undefined,
      }
    } else {
      console.log('whatLesson: count:', this.state.day[this.state.today - 1].count[0]);
      if (this.getTime(date) < this.getTimeFirstLesson(this.state.today)[0].slice(0, 5)) {
        console.log(true)
      }
      console.log("whatLesson: что за пара", this.getTime(date), when, this.getTimeFirstLesson(this.state.today)[0].slice(0, 5))
      if (this.state.today !== 0) {
        const currentLesson = this.getCurrentLesson(date);

        if (
          (currentLesson !== undefined) &&
          (when === "now")
        ) {
          for (let bellIdx in this.state.days[this.state.today - 1]) {
            if (
              (this.state.days[this.state.today - 1][bellIdx][0][5][0] === this.getCurrentLesson(date)) &&
              (this.state.days[this.state.today - 1][bellIdx][0][5][0] !== "")
            ) {
              return {
                lesson: this.state.days[this.state.today - 1][bellIdx][0][0],
                type: "now",
                num: parseInt(currentLesson)
              };
            }
          }

        } else if (
          (when === "will") &&
          (currentLesson !== undefined) &&
          (parseInt(currentLesson) + 1 < 8)
        ) {
          console.log("whatLesson: будет")
          for (let bell in this.state.days[this.state.today - 1]) {
            console.log('whatLesson:', parseInt(currentLesson) + 1);
            if (
              (this.state.days[this.state.today - 1][bell][0][5][0] == parseInt(currentLesson) + 1) &&
              (this.state.days[this.state.today - 1][bell][0][5][0] !== "")
            ) {
              return {
                lesson: this.state.days[this.state.today - 1][bell][0][0],
                type: "next",
                num: parseInt(currentLesson) + 1
              };
            }
          }
        } else if (
          (this.getTimeFirstLesson(this.state.today)[0].slice(0, 5) !== undefined) &&
          (this.getTime(date) <= this.getTimeFirstLesson(this.state.today)[0].slice(0, 5))
        ) {
          console.log('whatLesson:', this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0]);
          return {
            lesson: this.state.days[this.state.today - 1][`bell_${parseInt(this.getTimeFirstLesson(this.state.today)[1])}`][0][0],
            type: "will",
            num: parseInt(this.getTimeFirstLesson(this.state.today)[1])
          }
        } else {
          for (let i in breaks) {
            if (
              (this.getTime(date) > breaks[i].slice(0, 5) && this.getTime(date) < breaks[i].slice(6)) &&
              (this.state.days[this.state.today - 1][`bell_${i}`][0][5][0] !== "")
            ) {
              return {
                lesson: this.state.days[this.state.today - 1][`bell_${i}`][0][0],
                type: "will",
                num: parseInt(i)
              };
            } else {
              return {
                lesson: undefined,
                type: when,
                num: undefined
              };
            }
          }
        }
      }
    }
    return {
      lesson: undefined,
      type: when,
      num: undefined
    };
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
    if (this.state.today !== 0) {
      // определяем номер ближайшей пары
      for (let i in breaks) {
        if (this.getTime(date) < breaks['1']) {
          numberNearestLesson = '1';
          break
        } else if (
          this.getTime(date) > breaks[i].slice(0, 5) &&
          this.getTime(date) < breaks[i].slice(6)
        ) {
          numberNearestLesson = i;
          break
        } else if (this.getTime(date) > breaks['7']) {
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
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === numberNearestLesson) {
            return {
              audience: this.state.days[this.state.today - 1][bell][0].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)
            for (let bell in this.state.days[this.state.today - 1]) {
              if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] !== numberNearestLesson) {
                return {
                  audience: this.state.days[this.state.today - 1][bell][0].room,
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
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === this.getCurrentLesson(date)) {
            whereCurrentLesson = this.state.days[this.state.today - 1][bell][0].room
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
          if (this.state.days[this.state.today - 1][bell][0].lessonNumber[0] === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = this.state.days[this.state.today - 1][bell][0].room
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
    return this._assistant.sendData({
      action
    })
  }

  dispatchAssistantAction(action: AssistantAction) {
    if (action) {
      switch (action.type) {
        case 'profile':
          this.ChangePage()
          return this.setState({page: HOME_PAGE_NO});
          break;

        case 'for_today':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today === 0) {

              this.sendData({
                action_id: "todaySchedule",
                parameters: {
                  day: DAY_SUNDAY
                },
              })

              this.ChangePage()
              return this.setState({page: 7});

            } else {
              this.sendData({
                action_id: "todaySchedule",
                parameters: {day: DAY_NOT_SUNDAY},
              })

              this.ChangePage()
              return this.setState({page: this.state.today});
            }
          break;

        case 'for_tomorrow':
          if ((this.state.group !== "") || (this.state.teacher !== ""))
            if (this.state.today + 1 === 7) {
              this.sendData({
                action_id: "tomorrowSchedule",
                parameters: {day: DAY_SUNDAY},
              })
              this.ChangePage()
              return this.setState({page: 7});
            } else {
              this.sendData({
                action_id: "tomorrowSchedule",
                parameters: {day: DAY_NOT_SUNDAY},
              })
              this.ChangePage()
              return this.setState({page: this.state.today + 1});
            }
          break;

        case 'for_next_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.NextWeek();
            this.ChangePage()
            return this.setState({page: 8});
          }
          break;

        case 'for_this_week':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            this.ChangePage()
            return this.setState({date: Date.now(), flag: true, page: 17});
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
              this.ChangePage()
              return this.setState({page: this.state.today});
            } else if (this.state.today + 1 === 7) {
              this.ChangePage();
              return this.setState({page: 7});
            } else {
              this.ChangePage();
              this.setState({page: this.state.today + 1});
            }
          }
          break

        case 'how_many':
          let countOfLessons: [string, number] | undefined;
          let day: TodayOrTomorrow;
          let page = 0;
          if ((this.state.group !== "") || (this.state.teacher !== "")) {

            if (action.note !== undefined) {
              const {timestamp, dayOfWeek} = action.note;
              countOfLessons = this.getAmountOfLessons(new Date(timestamp))

              // todo: упростить
              if (String(this.state.today + 1) === dayOfWeek) {
                day = DAY_TODAY;
                page = 0
              } else if (String(this.state.today + 2) === dayOfWeek) {
                day = DAY_TOMORROW;
                page = 0
              } else { // fallback
                day = DAY_TODAY
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
              //   howManyParams = {
              //     day: DAY_SUNDAY,
              //   }
              //   // this.ChangePage();
              //   // this.setState({ page: 8 })
              //
              // } else {
              const [dayOfWeek, pairCount] = countOfLessons;

              const pairText = pairNumberToPairText(pairCount);

              howManyParams = {
                lesson: pairText,
                day: day,
                dayName: dayNameDict[countOfLessons[0]][0],
                amount: numPron[countOfLessons[1]]
              }
              if (dayNameDict[countOfLessons[0]][1] < this.state.today) {
                page = 7;
              }
              this.ChangePage();
              this.setState({page: dayNameDict[countOfLessons[0]][1] + page})
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
              this.setState({page: 7})
            } else {
              this.setState({page: this.state.today})
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
            this.ChangePage();
            if (whereLessonParams.exist === DAY_SUNDAY) {
              //this.setState({ page: 8 })
            } else {
              this.setState({page: this.state.today});
            }
          }
          break

        case 'what_lesson':
          console.log("какая пара")
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            if (action.note === undefined) {
              action.note = {
                "when": "now",
              }
            }
            const whatlesson = this.whatLesson(new Date(Date.now()), action.note.when);
            console.log(this.whatLesson(new Date(Date.now()), action.note.when))
            this.sendData({
              action_id: "say4",
              parameters: whatlesson,
            })
            this.ChangePage();
            if (this.state.today === 0) {
              this.setState({page: 7})
            } else {
              this.setState({page: this.state.today});
            }
          }
          break

        case 'first_lesson':
          if ((this.state.group !== "") || (this.state.teacher !== "")) {
            let number: string;
            let day1: TodayOrTomorrow = DAY_TODAY;
            let page1 = 0;
            if (action.note !== undefined) {
              const {dayOfWeek: strDayOfWeek} = action.note;
              const numDayOfWeek = parseInt(strDayOfWeek) - 1
              console.log('dispatchAssistantAction: first_lesson:', action.note)
              console.log('dispatchAssistantAction: first_lesson:', numDayOfWeek);
              number = this.getTimeFirstLesson(numDayOfWeek)[1]
              if (String(this.state.today + 1) === strDayOfWeek) {
                day1 = DAY_TODAY;
                page1 = 0
              } else if (String(this.state.today + 2) === strDayOfWeek) {
                day1 = DAY_TOMORROW;
                page1 = 0
              }
            } else {
              console.error('dispatchAssistantAction: first_lesson: action.note is undefined');
              // todo: fix fallback
              number = this.getTimeFirstLesson(0)[1];
              day = DAY_TODAY
            }
            let whichFirst: AssistantSendActionSay5['parameters'] = {
              day1: DAY_SUNDAY,
            }
            if (/*this.state.group !== "" && */number !== undefined) {
              // if (number === undefined) {
              //   whichFirst = {
              //     day1: DAY_SUNDAY,
              //   }
              //   // this.ChangePage();
              //   // this.setState({ page: 8 })
              // } else {
              const {dayOfWeek: strDayOfWeek} = action.note;
              const dayOfWeekIdx = parseInt(strDayOfWeek) - 1

              const [dayOfWeekNameLong, dayOfWeekIdx1] = dayNameDict[dayOfWeekIdx];

              whichFirst = {
                num: ordinalGenitiveCaseSingularFemDict[number[0]],
                day: day1,
                dayName: dayOfWeekNameLong
              }
              if (dayOfWeekIdx1 < this.state.today) {
                page1 = 7;
              }

              const newPage = dayOfWeekIdx1 + page1;
              this.ChangePage();
              this.setState({
                page: newPage,
              })
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

            const [dayOfWeekNameLong, dayOfWeekIdx1] = dayNameDict[dayOfWeekIdx];

            daySchedule = {
              dayName: dayOfWeekNameLong,
            }

            const newPage = dayOfWeekIdx1 + page2;
            this.ChangePage();
            this.setState({
              page: newPage,
            })
            // }
            this.sendData({
              action_id: "say6",
              parameters: daySchedule,
            })
          }
          break

        case 'show_schedule':
          console.log("показать расписание");
          if (this.state.page === 0)
            return this.isCorrect();
          break;

        case 'group':
          if (action.note[0] === 0) {
            console.log(action.note[1].data.groupName[0]);
            this.setState({group: action.note[1].data.groupName[0].toUpperCase(), page: HOME_PAGE_NO});
          } else {
            console.log(action.note[1].data.groupName[1])
            this.setState({group: action.note[1].data.groupName[1].toUpperCase(), page: HOME_PAGE_NO})
          }
          break

        case 'subgroup':
          console.log('subgroup', action)
          this.ChangePage();
          this.setState({subGroup: action.note, page: HOME_PAGE_NO});
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

  // assistant_global_event(phrase) {
  //   this._assistant.sendData({
  //     action: {
  //       action_id: phrase
  //     }
  //   })
  // }

  convertIdInGroupName() {
    for (let group of groups) {
      console.log(this.state.groupId, "id")
      if (String(this.state.groupId) === String(group.id)) {
        this.setState({group: group.name})
        console.log(group.name, "группа")
      }
    }
  }

  convertGroupNameInId() {
    for (let group of groups) {
      if (this.state.group.toLowerCase() === group.name.toLowerCase()) {
        const groupId = '' + group.id; // convert to string
        this.setState({groupId}, () => {
          console.log(`groupId ${this.state.groupId}`)
        })
      }
    }
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

  async getScheduleFromDb(date: number) {
    const firstDayWeek = this.getFirstDayWeek(new Date(date));
    if (!this.state.student && this.state.teacher_correct) {
      await getScheduleTeacherFromDb(
        this.state.teacherId,
        firstDayWeek
      ).then((response) => {
        this.showWeekSchedule(response, 1);
      })
    } else {
      await getScheduleFromDb(
        this.state.groupId,
        this.state.engGroup,
        firstDayWeek
      ).then((response) => {
        this.showWeekSchedule(response, 1);
        console.log(response)
      })
    }
    this.setState({date: date, flag: false});
  }

  /**
   * Заполнение расписанием на следующую неделю
   */
  async NextWeek() {
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
    const dateMinusWeek = this.state.date - SEVEN_DAYS;
    return this.getScheduleFromDb(dateMinusWeek);
  }

  showWeekSchedule(parsedSchedule: IScheduleApiData, i) { //заполнение данными расписания из бд
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
    }

    for (let day_num = 1; day_num < 7; day_num++) {

      // todo
      let countLessons = this.state.day[day_num - 1].count[i]
      countLessons = 0;

      if (parsedSchedule.schedule !== null) {
        this.state.day[day_num - 1].date[i] = parsedSchedule.schedule_header[`day_${day_num}`].date;
        for (let bell in parsedSchedule.schedule) { //проверка
          let bell_num = Number(bell.slice(-1)) - 1
          let lesson_info: IScheduleLessonInfo = parsedSchedule.schedule[bell][`day_${day_num}`].lessons[0]
          let lesson_info_state: Bell = days[day_num - 1][bell_num][i]

          const subgroup_name = lesson_info?.groups?.[0]?.subgroup_name;

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
            lesson_info_state.startAndFinishTime = `${parsedSchedule.schedule[bell].header.start_lesson} 
            - ${parsedSchedule.schedule[bell].header.end_lesson}`;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info.other;
            countLessons++;

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
            lesson_info_state.startAndFinishTime = `${parsedSchedule.schedule[bell].header.start_lesson} 
            - ${parsedSchedule.schedule[bell].header.end_lesson}`;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = `${bell.slice(5, 6)}. `;
            lesson_info_state.url = lesson_info.other;

            for (let name in lesson_info.groups) {
              lesson_info_state.groupNumber += `${lesson_info.groups[name].name} `;
            }
            countLessons++;

          } else {
            lesson_info_state.reset();
          }
        }
        if (countLessons === 0)
          days[day_num - 1][0][i].lessonName = NO_LESSONS_NAME;

      } else {
        days[day_num - 1][0][i].lessonName = NO_LESSONS_NAME;
      }

    }
    this.setState({spinner: true});
    this.setState({days: days});
  }


  ChangePage() {

    let timeParam = this.state.page;
    let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
    if (timeParam > 7) {
      weekParam = OTHER_WEEK
      timeParam -= 7
    }

    this.setState({i: 0});
    this.setState({star: false});
    if (weekParam === OTHER_WEEK) {
      this.setState({flag: false});
    } else {
      this.setState({flag: true});
    }
    if (this.state.checked) {
      this.setState({star: true});
    } else {
      if (this.state.groupId == this.state.bd) {
        this.setState({star: true});
      } else {
        this.setState({star: false});
      }
    }
    if (this.state.teacher_checked) {
      this.setState({teacher_star: true});
    } else {
      if (this.state.teacherId == this.state.teacher_bd) {
        this.setState({teacher_star: true});
      } else {
        this.setState({teacher_star: false});
      }
    }
  }


  Raspisanie(timeParam: number) {
    let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
    if (timeParam > 7) {
      timeParam -= 7;
      weekParam = OTHER_WEEK
    }
    // this.setState({i: 0});
    const current = this.getCurrentLesson(new Date(Date.now()));
    const day_num = timeParam - 1;
    const index = timeParam;
    const page = weekParam === OTHER_WEEK ? 8 : 0;

    // const groupName = getFullGroupName(this.state.group, this.state.subGroup);

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.state.character)
        }
        <div>
          <Container style={{padding: 0, overflow: "hidden"}}>

            <TopMenu
              state={this.state}
              setState={this.setState}
              setValue={this.setValue}
              onHomeCLick={() => this.setState({page: HOME_PAGE_NO})}
              onNavigatorCLick={() => this.setState({page: NAVIGATOR_PAGE_NO})}
            />

            <WeekSelect
              onPrevWeekClick={() => {
                this.setState({spinner: false});
                this.PreviousWeek();
                this.setState({page: 9})
              }}
              onThisWeekClick={() => {
                this.CurrentWeek();
                this.setState({flag: true, page: 17})
              }}
              onNextWeekClick={() => {
                this.setState({spinner: false});
                this.NextWeek();
                this.setState({page: 9})
              }}
            />

            <WeekCarousel
              carouselIndex={this.state.i}
              selectedWeekDayIndex={index-1}
              todayWeekDayIndex={weekParam===THIS_WEEK ? this.state.today-1 : -1 /* current weekday can't be on 'other' week*/}
              weekDays={this.state.day.map(d => {
                return { title: d.title, date: d.date[weekParam] }
              })}
              onIndexChange={(index) => this.Index()}
              onDayClick={(weekDayIndex) => this.setValue("page", (
                weekDayIndex + page + (weekParam==OTHER_WEEK ? 0: 1)
              ))}
            />

            <ScheduleDayFull
              spinner={this.state.spinner}
              days={this.state.days}
              day_num={day_num}
              current={current}
              weekParam={weekParam}
              timeParam={timeParam}
              student={this.state.student}
              teacher_correct={this.state.teacher_correct}
              today={this.state.today}
              validateTeacher={this.isCorrectTeacher}
              onSetValue={this.setValue}
            />

            <MyDiv200/>

          </Container>
        </div>
      </DeviceThemeProvider>
    );
  }

  Index() {
    const currI = this.state.i;
    if (currI < 7) {
      this.setState({i: currI + 1});
    } else if (currI > 0) {
      this.setState({i: currI - 1});
    }
  }

  async isCorrectTeacher() {

    getIdTeacherFromDb(this.state.teacher).then((teacherData) => {
      console.log('isCorrectTeacher:', teacherData);
      console.log('isCorrectTeacher: status:', teacherData.status);

      if (teacherData.status == "-1") {
        console.log("status");
        this.setState({
          color_teacher: COLOR_NAME_ERROR,
        })
      } else if (teacherData.status == "-2") {
        this.setState({
          color_teacher: COLOR_NAME_WARN_RU,
        })

      } else {

        getScheduleTeacherFromDb(
          teacherData.id,
          this.getFirstDayWeek(new Date(Date.now()))
        ).then((response) => {
          this.showWeekSchedule(response, 0);
        });

        getInTeacherFromDb(teacherData.id).then((parsedTeacher2) => {
          this.setState({
            teacher: `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`
          })
        })

        this.setState({
          teacherId: teacherData.id,
          student: false,
          teacher_correct: true,
          date: Date.now(),
          flag: true,
          page: 7,
          color_teacher: DEFAULT_TEXT_COLOR,
        });

      }
      if (this.state.teacher_checked) {
        createUser(
          this.state.userId,
          // todo hardcoded 880
          "880",
          String(this.state.groupId),
          String(this.state.subGroup),
          String(this.state.engGroup),
          String(this.state.teacherId),
        );
      }
    })
  }

  isCorrect() {
    this.setState({correct: false, date: Date.now()})
    let correct_sub = false;
    let correct_eng = false;
    for (let i of groups) {
      if (this.state.group.toLowerCase() === i.name.toLowerCase()) {
        this.setState({correct: true})
        console.log(`isCorrect: Correct ${this.state.correct}`)
        this.convertGroupNameInId()
      }
    }
    for (let i of engGroups) {
      if ((this.state.engGroup == i) || (this.state.engGroup === "")) {
        correct_eng = true;
        console.log(`isCorrect: Correct ${correct_eng}`);
      }
    }
    if ((this.state.subGroup === "") || (this.state.subGroup === "1") || (this.state.subGroup === "2")) correct_sub = true;

    if (this.state.correct && correct_sub && correct_eng) {

      if (this.state.checked) {
        createUser(
          this.state.userId,
          "808",
          String(this.state.groupId),
          String(this.state.subGroup),
          String(this.state.engGroup),
          "",
        );
      }

      getScheduleFromDb(
        this.state.groupId,
        String(this.state.engGroup),
        this.getFirstDayWeek(new Date(Date.now()))
      ).then((response) => {
        this.showWeekSchedule(response, 0);
      });

      console.log(String(this.state.engGroup));
      this.setState({flag: true});
      this.convertIdInGroupName();
      this.setState({page: 7, color_group: COLOR_NAME_WARN_RU});

    } else if (this.state.correct === true) {
      this.setState({color_group: COLOR_NAME_WARN_RU});

    } else if (this.state.group === "") {
      this.setState({color_group: COLOR_NAME_ERROR})

    } else {
      this.setState({color_group: COLOR_NAME_ERROR})
    }

    if (!correct_sub) {
      this.setState({color_sub: COLOR_NAME_ERROR})
    } else {
      this.setState({color_sub: COLOR_NAME_WARN_RU, star: false});
    }

    if (!correct_eng) {
      this.setState({color_enggroup: COLOR_NAME_ERROR})
    } else {
      this.setState({color_enggroup: COLOR_NAME_WARN_RU, star: false});
    }
  }

  Spinner() {
    var myinterval = setInterval(() => {
      if (this.state.spinner === true) {
        setTimeout(() => {
          if (this.state.today === 0) {
            if (this.state.flag === true)
              this.setState({page: 8})
            else this.setState({page: 9})
          } else if (this.state.flag === true) this.setState({page: this.state.today});
          else this.setState({page: 9});

        }, 100);
        clearInterval(myinterval)
      }
    }, 100);

    return (
      <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.state.character)
        }
        <div>
          <Container style={{padding: 0}}>
            <Spinner color={ACCENT_TEXT_COLOR}
                     style={{position: " absolute", top: "40%", left: " 43%", marginRight: "-50%"}}/>
          </Container>
        </div>
      </DeviceThemeProvider>
    )
  }

  render() {
    console.log('render');
    let page = this.state.page;
    if (page >= 1 && page <= 13) {
      return this.Raspisanie(page);
    }
    switch (this.state.page) {
      case HOME_PAGE_NO:
        return <HomeView
          state={this.state}
          isCorrect={this.isCorrect}
          convertIdInGroupName={this.convertIdInGroupName}
          isCorrectTeacher={this.isCorrectTeacher}
          setValue={this.setValue}
          groupId={this.state.groupId}
          description={this.state.description}
          character={this.state.character}
          student={this.state.student}
          teacher={this.state.teacher}
          color_group={this.state.color_group}
          group={this.state.group}
          subGroup={this.state.subGroup}
          color_sub={this.state.color_sub}
          color_enggroup={this.state.color_enggroup}
          checked={this.state.checked}
          teacher_checked={this.state.teacher_checked}
        />
      case NAVIGATOR_PAGE_NO:
        return <Navigator
          state={this.state}
          setValue={this.setValue}
        />
      case DASHBOARD_PAGE_NO:
        return <Dashboard
          state={this.state}
          setValue={this.setValue}
          getCurrentLesson={this.getCurrentLesson}
          whatLesson={this.whatLesson}
        />
      case 17:
        return this.Spinner();
      default:
        break;
    }
  }
}
