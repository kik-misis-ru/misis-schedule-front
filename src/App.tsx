import React from "react";
import {Router, Route, Switch} from 'react-router';
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.css';
import {detectDevice} from '@sberdevices/plasma-ui/utils';

import number from './language-ru/Number';
import DayOfWeek from './language-ru/DayOfWeek';

import {
  createUser,
  getGroupById,
  getGroupByName,
  getScheduleFromDb,
  IsEnglishGroupExist,
  getSchedulebyUserId,
} from "./lib/ApiHelper";
import ApiModel, 
{IStudentValidation,
  IStudentSettings
} from "./lib/ApiModel";

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
  NowOrWill,
} from './types/AssistantReceiveAction.d'
import {
  AssistantSendAction,
  AssistantSendActionSay,
  AssistantSendActionSay1,
  AssistantSendActionSay2,
  AssistantSendActionSay3,
  AssistantSendActionSay4,
  AssistantSendActionSay5,
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
  getFirstDayWeek,
  MS_IN_DAY,
} from './lib/datetimeUtils';
import {
  pairNumberToPairText
} from './language-ru/utils';


import Lesson from "./pages/Lesson";
import {AssistantWrapper} from './lib/AssistantWrapper';

export type SetValueKeys = keyof Pick<IAppState, 'page'|'flag'> /*extends keyof IAppState*/;
export type SetValueFn = <K extends SetValueKeys>(
  key: K,
  value: IAppState[K],
) => void;

export const HOME_PAGE_ROUTE = "home";

const INITIAL_PAGE = 16;

const SEVEN_DAYS = 7 * MS_IN_DAY;
const ENTER_DATA_NO_OFFICIAL_TEXT = "Заполни данные, чтобы открывать расписание одной фразой";
const ENTER_DATA_OFFICIAL_TEXT = "Чтобы посмотреть расписание, укажите данные учебной группы";

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

export const LessonStartEnd: StartEnd[] = Array(MAX_BELL_COUNT).fill({start: "", end: ""})

export const history = createBrowserHistory();

const getTodayDayOfWeek = () => (new Date()).getDay();

//
interface IAppProps {
}

export interface IAppState {
  notes: { id: string, title: string }[];
  page: number
  flag: boolean
  spinner: boolean
  date: number
  character: CharacterId
  theme: string
  dayPush: number
  isActive: boolean
  isUser: boolean
}

export class App extends React.Component<IAppProps, IAppState> {
  assistant: AssistantWrapper
  apiModel: ApiModel

  constructor(props: IAppProps) {
    super(props);
    this.apiModel = new ApiModel()
    this.Load_Schedule = this.Load_Schedule.bind(this)
    this.CheckIsCorrect = this.CheckIsCorrect.bind(this)
    this.getCurrentLesson = this.getCurrentLesson.bind(this);
    this.NextWeek = this.NextWeek.bind(this);
    this.CurrentWeek = this.CurrentWeek.bind(this);
    this.PreviousWeek = this.PreviousWeek.bind(this);
    this.Load_Schedule = this.Load_Schedule.bind(this);
    this.doSetTeacher = this.doSetTeacher.bind(this)
    this.getIsCorrectTeacher = this.getIsCorrectTeacher.bind(this)
    this.setValue = this.setValue.bind(this);
    console.log('constructor');
    history.push("/dashboard")
    this.state = {
      notes: [],
      page: INITIAL_PAGE,
      flag: true,
      spinner: false,
      date: Date.now() ,
      theme: "dark",
      isActive: false,
      character: CHAR_SBER,
      isUser: false,
      dayPush: 0,
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
    });
  }

  async handleAssistantSub(userId: string) {
    console.log("handleAssistantSub: userId", userId);

    this.apiModel = new ApiModel()
    this.apiModel.fetchUser(userId)
    const user = this.apiModel.user;
    console.log('handleAssistantSub: user', user)

    if (this.apiModel.userId != undefined && this.apiModel.userId != "") {

      const userSchedule = await getSchedulebyUserId(userId)
      // .then((userSchedule) => {
      console.log("handleAssistantSub: getScheduleByUserId", userSchedule)

      this.apiModel.pushSettings = {
        IsActive: userSchedule.isActive,
        Hour: userSchedule.hour,
        Minute: userSchedule.minute,
      }

      await this.apiModel.getSchedulebyUserId()
      this.setState({spinner: true});
      console.log("USER:", this.apiModel)

      history.push("/dashboard")

      // Проверяем, сохранен ли пользователь
      if (!this.apiModel.isSavedUser) {
        console.log("handleAssistantSub: first time")

        this.setState({isUser: true});

        history.push('/start')

        // Проигрываем начальное приветствие
        this.assistant.sendHello()

        // Создаем пользователя в базе данных с текущими настройками
        await this.apiModel.createUser()
      }
    }
  }

  handleAssistantPageChange(pageRoute: string) {
    history.push(pageRoute)
  }

  handleAssistantSetValue(
    key: 'group' | 'subGroup' | 'engGroup',
    value: string
  ) {
    console.log(`handleAssistantSetValue: key: ${key}, value:`, value);

    this.setState((prevState) => (
      {
        ...prevState,
        [key]: value,
      }
    ))
  }

  async handleAssistantForDayOffset(offset: 0 | 1) {
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      const isSunday = (
        getTodayDayOfWeek() + offset === 0 ||
        getTodayDayOfWeek() + offset === 7
      );

      if (isSunday) {
        this.assistant.sendTodaySchedule(DAY_SUNDAY);
        return this.ChangeDay(7);

      } else {
        offset== 0 ? this.assistant.sendTodaySchedule(DAY_NOT_SUNDAY) : this.assistant.sendTomorrowSchedule(DAY_NOT_SUNDAY)
        return this.ChangeDay(getTodayDayOfWeek() + offset);
      }
    }
  }

  async handleAssistantForNextWeek() {
    if (this.apiModel.CheckGroupOrTeacherSetted()) {
      await this.NextWeek(this.apiModel.isSavedSchedule);
      return this.ChangeDay(FIRST_DAY_OTHER_WEEK);
    }
  }

  async handleAssistantForThisWeek() {
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      await this.CurrentWeek(this.apiModel.isSavedSchedule);
      this.ChangeDay(getTodayDayOfWeek());
    }
  }

  async handleAssistantWhenLesson(
    type1: StartOrEnd,
    day1: TodayOrTomorrow,
    lessonNum: string,   // порядковый номер пары
  ) {
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      let params: AssistantSendActionSay['parameters'];
      // const [type1, day1, lessonNum] = action.note || [];
      // day1 == "today" ? dayOfWeekZeroIndex = this.state.today - 1 : dayOfWeekZeroIndex = this.state.today;
      const dayOfWeekZeroIndex = day1 === DAY_TODAY
        ? getTodayDayOfWeek() 
        : getTodayDayOfWeek() + 1;
      console.log(type1, dayOfWeekZeroIndex, lessonNum, "when")
      let startEndLesson = this.getStartEndLesson(type1, dayOfWeekZeroIndex, lessonNum)
      console.log('dispatchAssistantAction: startEndLesson:', startEndLesson)

      if (startEndLesson !== undefined && startEndLesson[1] === DAY_SUNDAY) {
        // todo: startEndLesson is string|[string,string]
        const type2 = startEndLesson[0];
        const day2 = startEndLesson[1];
        params = {
          type: type2,
          day: day2,
        }
      } else {
        params = {
          type: type1,
          day: day1,
          ordinal: number.ordinal.fem.singular.nominative[lessonNum],
          time: startEndLesson
        }
      }

      this.assistant.sendAction({
        action_id: "say",
        parameters: params,
      })

      if ((params.day === DAY_TODAY) && (getTodayDayOfWeek() !== 0)) {
        return this.ChangeDay(getTodayDayOfWeek());

      } else if (getTodayDayOfWeek() + 1 === 7) {
        return this.ChangeDay(7);

      } else {
        this.ChangeDay(getTodayDayOfWeek() + 1);
      }
    }
  }

  handleAssistantHowMany(date: Date | undefined, dayOfWeek: number | undefined) {
    console.log('handleAssistantHowMany: date', date, 'dayOfWeek:', dayOfWeek)

    // let amountOfLessonsTuple: [string, number] | undefined;
    let day: TodayOrTomorrow | undefined;
    let page = 0;
     if (this.apiModel.CheckGroupOrTeacherSetted()) {

      if (date) {
        if (getTodayDayOfWeek() + 1 === dayOfWeek) {
          day = DAY_TODAY;
        } else if (getTodayDayOfWeek() + 2 === dayOfWeek) {
          day = DAY_TOMORROW;
        } else { // fallback
          day = undefined
        }

      } else {
        date = new Date();
        day = DAY_TODAY
      }

      let assistantParams: AssistantSendActionSay1['parameters'];

      const lessonCount = this.getLessonsCountForDate(date)
      let groupApiModel = this.apiModel.user?.group==undefined ? "" : this.apiModel.user.group
      if (groupApiModel !== "" && lessonCount > 0) {
        // const [dayOfWeekShort, lessonCount] = amountOfLessonsTuple;
        const lessonText = pairNumberToPairText(lessonCount);

        // const [dayOfWeekLongPrepositional, dayOfWeekIndex] = dayNameDict[dayOfWeekShort]
        // const dayOfWeekIndex = DayOfWeek.short.indexOf(dayOfWeekShort)
        const dayOfWeekIndex = date.getDay();
        const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekIndex]?.toLowerCase();

        assistantParams = {
          day: day,
          lesson: lessonText,
          dayName: dayOfWeekLongPrepositional,
          amount: number.cardinal.fem[lessonCount]
        }
        if (dayOfWeekIndex < getTodayDayOfWeek()) {
          page = 7;
        }

        this.ChangeDay(dayOfWeekIndex + page)

      } else {
        assistantParams = {
          day: DAY_SUNDAY,
        };
      }

      this.assistant.sendAction({
        action_id: "say1",
        parameters: assistantParams,
      })
    }
  }

  // Сколько пар осталось (сегодня)
  handleAssistantHowManyLeft() {
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      let assistantParams: AssistantSendActionSay2['parameters'];
      let amountOfRemainingLessons = this.getAmountOfRemainingLessons(new Date())

      if (getTodayDayOfWeek() === 0) {
        assistantParams = {
          day: DAY_SUNDAY,
        }

      } else {
        assistantParams = {
          amount: String(amountOfRemainingLessons),
          pron: number.cardinal.fem[amountOfRemainingLessons]
        }
      }

      this.assistant.sendAction({
        action_id: "say2",
        parameters: assistantParams,
      })

      if ((this.apiModel.isSavedUser && this.apiModel.user?.group_id!="") || (this.apiModel.isSavedUser && this.apiModel.unsavedUser?.group_id!="")) {
        this.ChangePage();
      }

      if (getTodayDayOfWeek() === 0) {
        this.gotoPage(7)
      } else {
        this.gotoPage(getTodayDayOfWeek())
      }
    }
  }

  handleAssistantWhere(when: NowOrWill) {
    console.log('handleAssistantWhere: when:', when)
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      const whereLessonParams: AssistantSendActionSay3['parameters'] = this.whereWillLesson(new Date(this.state.date), when)
      this.assistant.sendAction({
        action_id: "say3",
        parameters: whereLessonParams,
      })

      if (whereLessonParams.exist === DAY_SUNDAY) {
        //this.setState({ page: 8 })
      } else {
        this.ChangeDay(getTodayDayOfWeek());
      }
    }
  }

  handleAssistantWhatLesson(when: NowOrWill) {
    console.log("handleAssistantWhatLesson: when:", when)
     if (this.apiModel.CheckGroupOrTeacherSetted()) {

      const whatLesson: AssistantSendActionSay4['parameters'] = this.whatLesson(new Date(), when);
      console.log('dispatchAssistantAction: what_lesson: whatLesson:', whatLesson)

      this.assistant.sendAction({
        action_id: "say4",
        parameters: whatLesson,
      })

      if (getTodayDayOfWeek() === 0) {
        this.ChangeDay(7)
      } else {
        this.ChangeDay(getTodayDayOfWeek());
      }

    }
  }

  handleAssistantFirstLesson(dayOfWeek: number) {
     if (this.apiModel.CheckGroupOrTeacherSetted()) {

      let firstLessonNumStr: string;
      // let day: TodayOrTomorrow;
      let day1: undefined | TodayOrTomorrow = DAY_TODAY;
      let page1 = 0;

      const dayOfWeekZeroIndex = dayOfWeek - 1
      console.log('dispatchAssistantAction: first_lesson:', dayOfWeek)
      firstLessonNumStr = this.getStartFirstLesson(dayOfWeekZeroIndex)[1]

      if (firstLessonNumStr === undefined) {
        console.warn('dispatchAssistantAction: firstLessonNumStr is undefined')
      }

      if (getTodayDayOfWeek() === dayOfWeek - 1) {
        day1 = DAY_TODAY;
        page1 = 0

      } else if (getTodayDayOfWeek() + 1 === dayOfWeek - 1) {
        day1 = DAY_TOMORROW;
        page1 = 0

      } else {
        day1 = undefined;
      }

      const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekZeroIndex]?.toLowerCase();

      const assistantParams: AssistantSendActionSay5['parameters'] = {
        num: number.ordinal.fem.singular.genitive[firstLessonNumStr/*[0]*/],
        day: day1,
        dayName: dayOfWeekLongPrepositional
      }
      console.log('dispatchAssistantAction: assistantParams:', assistantParams)

      if (dayOfWeekZeroIndex < getTodayDayOfWeek()) {
        page1 = 7;
      }

      const newPage = dayOfWeekZeroIndex + page1;
      this.gotoPage(newPage)


      this.assistant.sendAction({
        action_id: "say5",
        parameters: assistantParams,
      })
    }
  }

  async handleAssistantDaySchedule(dayOfWeek: number, note1, note2) {
    console.log('handleAssistantDaySchedule:', dayOfWeek, note1, note2)
     if (this.apiModel.CheckGroupOrTeacherSetted()) {
      const dayOfWeekZeroIndex = dayOfWeek - 1;
      let page2 = 0;

      // todo: упростить

      if (note1 === null && note2 === null) {
        console.log('dispatchAssistantAction: day_schedule: flag:', this.state.flag);

        if (!this.state.flag) {
          page2 = 7;

        } else {
          page2 = 0;
        }

      } else {
        console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', dayOfWeekZeroIndex);

        if (note1 !== null) {
          console.log('dispatchAssistantAction: day_schedule: note[1]:', note1);
          page2 = 0;

        } else if (note2 !== null) {
          console.log('dispatchAssistantAction: day_schedule: note[2]:', note2);
          page2 = 7;

        }
      }

      console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', dayOfWeekZeroIndex)

      // todo: test dayOfWeek/dayOfWeekZeroIndex/dayOfWeekShort

      // const dayOfWeekShort = this.state.day[dayOfWeekZeroIndex - 1].title;
      // const dayOfWeekIndex_ = DayOfWeek.short.indexOf(dayOfWeekShort)
      const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekZeroIndex]?.toLowerCase();

      this.assistant.sendSay6(dayOfWeekLongPrepositional);

      const newPage = dayOfWeekZeroIndex + page2;
      this.gotoPage(newPage)

    }
  }

  async handleAssistantShowSchedule(actionNote: string | undefined) {
    console.log('dispatchAssistantAction: show schedule', actionNote);
    if (actionNote) {

      const isStudent = !actionNote.includes("препод")

      this.assistant.sendChangeGroup(isStudent);

    } else {
      let success = true;

      if (history.location == HOME_PAGE_ROUTE) {
        if (this.apiModel.isStudent) {
          //TODO!!!!!!!!!
          //success = await this.CheckIsCorrect()
        } else {
          //TODO!!!!
          // success = (await this.apiModel.handleTeacherChange(true)).IsInitialsError;
        }
      }

      if (success) {
        await this.Load_Schedule(this.apiModel.isSavedSchedule)
        history.push('/')
      }

    }
  }

  setValue<K extends SetValueKeys>(
    key: K,
    value: IAppState[K],
  ): void {
    console.log(`setValue: key: ${key}, value:`, value);
    this.setState((prevState) => (
      {
        ...prevState,
        [key]: value,
      }
    ))
  }


  //Зачем проверка на correct?
  getIsCorrectTeacher(): boolean {
    return !this.apiModel.isStudent
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
    if (dayNumber < getTodayDayOfWeek()) {
      for (let lessonIdx in this.apiModel.saved_schedule.other_week[dayNumber - 1]) {
        const lesson = this.apiModel.saved_schedule.other_week[dayNumber - 1][lessonIdx]
        if (lesson.lessonName !== "") {
          lessonsStart = LessonStartEnd[Number(lessonIdx)].start
          console.log('getStartFirstLesson: lessonIdx:', lessonIdx)
          lessonNumber = String(Number(lessonIdx) + 1);
          break
        }
      }
    } else {
    for (let lessonIdx in this.apiModel.saved_schedule.current_week[dayNumber - 1]) {
      const lesson = this.apiModel.saved_schedule.current_week[dayNumber - 1][lessonIdx]
      if (lesson.lessonName !== "") {
        lessonsStart = LessonStartEnd[Number(lessonIdx)].start
        console.log('getStartFirstLesson: lessonIdx:', lessonIdx)
        lessonNumber = String(Number(lessonIdx) + 1);
        break
      }
    }
  }
    return [lessonsStart, lessonNumber];
  }


  // определяет когда кончаются пары сегодня или завтра
  getEndLastLesson(todayOrTomorrow: number): string {
    let lessonEnd = '';
    for (let lessonIdx in this.apiModel.saved_schedule.current_week[todayOrTomorrow]) {
      if (this.apiModel.saved_schedule.current_week[todayOrTomorrow][lessonIdx].lessonName !== "") {
        lessonEnd = LessonStartEnd[lessonIdx].end;
      }
    }
    return lessonEnd;
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(startOrEnd: StartOrEnd, dayOfWeekIndex: number, lessonNum: number): string | undefined {

    const lessonName = this.apiModel.saved_schedule.current_week[dayOfWeekIndex][lessonNum - 1].lessonName;

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
      if (dayOfWeekIndex === getTodayDayOfWeek()) {
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
      if (dayOfWeekIndex === getTodayDayOfWeek()) {
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

  /**
   * подсчет количества пар в указанную дату
   *
   * @param {Date} date
   * @returns number    - количество пар в этот день
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
   * получить текущую пару
   *
   * @param date
   */
  getCurrentLesson(date: Date): string {
    if (getTodayDayOfWeek() !== 0) {
      const todayIndex = getTodayDayOfWeek() - 1
      const day = this.apiModel.saved_schedule.current_week[todayIndex]
      for (let bellIdx in day) {
        // console.log(`getCurrentLesson: bellIdx: ${bellIdx}, typeof bellIdx: ${typeof bellIdx}`);
        const lesson = day[bellIdx];
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
    const todayDayOfWeek = getTodayDayOfWeek();

    if ((todayDayOfWeek !== 0) && (todayDayOfWeek + 1 !== 7))
      for (let bell in this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1]) {
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
  } {
    console.log(`whatLesson: when: ${when} date:`, date)
    // определяет название пары, которая идет или будет
    // ключ - номер пары, значение - перерыв до этой пары
    const todayDayOfWeek = getTodayDayOfWeek();

    const isSunday = (todayDayOfWeek === 0)
    const todayWorkDayZeroIndex = todayDayOfWeek - 1;
    const todayBells = this.apiModel.day.current_week[todayWorkDayZeroIndex]
    const todayLessons = this.apiModel.saved_schedule.current_week[todayWorkDayZeroIndex]

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
    const todayDayOfWeek = getTodayDayOfWeek()

    // проверяем, что сегодня не воскресенье
    const isSunday = (todayDayOfWeek === 0)

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
        for (let bell in this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1]) {
          // если пара с таким номером есть в расписании
          if (this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].lessonNumber === numberNearestLesson) {
            return {
              audience: this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`whereWillLesson: Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)

            for (let bell in this.apiModel.saved_schedule[todayDayOfWeek - 1]) {
              if (this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].lessonNumber !== numberNearestLesson) {
                return {
                  audience: this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].room,
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
        for (let bell in this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1]) {
          if (this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].lessonNumber === this.getCurrentLesson(date)) {
            whereCurrentLesson = this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].room
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
        for (let bell in this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1]) {
          if (this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].lessonNumber === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1][bell].room
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


  /**
   * Переход на следующую неделю
   */
  async NextWeek(isSave: boolean) {
    this.setState({spinner: false});
    const datePlusWeek = this.state.date + SEVEN_DAYS;
    await this.apiModel.getScheduleFromDb(datePlusWeek, isSave, false);
    this.setState({date: datePlusWeek})
    this.setState({spinner: true});
  }

  /**
   * Переход на следующую неделю
   */
  async CurrentWeek(isSave: boolean) {
    this.setState({spinner: false});
    const date = Date.now();
    this.setState({date: date})
    await this.apiModel.getScheduleFromDb(date, isSave, true);
    this.setState({spinner: true});
  }

  /**
   * Переход на предыдущую неделю
   */
  async PreviousWeek(isSave: boolean) {
    this.setState({spinner: false});
    const dateMinusWeek = this.state.date - SEVEN_DAYS;
    this.setState({date: dateMinusWeek})
    await this.apiModel.getScheduleFromDb(dateMinusWeek, isSave, false);
    this.setState({spinner: true});
  }


  ChangeDay(day: number): void {
    this.ChangePage();
    this.gotoPage(day);
  }


  ChangePage() {
    let timeParam = this.state.page;
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

  toggleTheme() {
    console.log('toggleTheme:', this.state.theme)
    if (this.state.theme === "dark") this.setState({theme: "light"})
    else this.setState({theme: "dark"})
  }


  async _loadSchedule(isSave: boolean): Promise<void> {
    let group_id = isSave ? this.apiModel.user?.group_id : this.apiModel.unsavedUser?.group_id
    let eng_group = isSave ?  this.apiModel.user?.eng_group : this.apiModel.unsavedUser?.eng_group
    if(eng_group == undefined){
      eng_group = ""
    }
    if(group_id == undefined){
      return
    }
    await getScheduleFromDb(
      group_id,
      String(eng_group),
      getFirstDayWeek(new Date())
    )
      .then((response) => {
        this.apiModel.SetWeekSchedule(response, 0, isSave);
      })
  }

  async Load_Schedule( isSave: boolean): Promise<void> {
    console.log("Load_Schedule. IsSave:", isSave)
    return await this._loadSchedule(isSave);
  }

  //Проверяет правильность ввода данных студента
  async CheckIsCorrect(settings: IStudentSettings, isSave: boolean): Promise<IStudentValidation> {
    console.log('App: isCorrect', settings)
    //this.setState({correct: false, date: Date.now(), flag: true});
    let IsError: IStudentValidation ={
      IsGroupNameError: true,
      IsSubGroupError: true,
      IsEngGroupError: true
    }
    let promiseGroupName = getGroupByName(settings.groupName);
    let promiseEnglishGroup = IsEnglishGroupExist(Number(settings.engGroupName));

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
          IsError.IsGroupNameError = false;
        }
        if (english_response || settings.engGroupName == "") {
          IsError.IsEngGroupError = false;
          console.log(`App: isCorrect: correct_eng: ${ IsError.IsEngGroupError}`);
        }
        if ((settings.subGroupName === "") || (settings.subGroupName.replace(/[\s-_.]/g, '') === "1") || (settings.subGroupName.replace(/[\s-_.]/g, '') === "2")) {
          IsError.IsSubGroupError = false;
        }
        const groupId = String(group.id);
        let isCorrect = !IsError.IsEngGroupError && !IsError.IsGroupNameError && !IsError.IsSubGroupError
        if (isCorrect ) {
          console.log("create_user", history.location.pathname)
          let updateUser ={
            group_id: groupId,
            group : group.name,
            eng_group: settings.engGroupName,
            subgroup_name: settings.subGroupName,
            teacher_id: "",
            teacher: "",
            filial_id: this.apiModel.user== undefined ? "" : this.apiModel.user.filial_id
          }
          if(isSave){
            createUser(
            this.apiModel.userId,
            filial.id,
            group.id,
            settings.subGroupName,
            settings.engGroupName,
            ""
          )
            this.apiModel.user = updateUser
          }
          else{
            this.apiModel.unsavedUser = updateUser
          }
          
        }
        return IsError
      })
      
    }
 async doSetTeacher(teacherName){
    let res = await this.apiModel.doSetTeacher(teacherName)
    if(res && (history.location.pathname == '/home')){
      history.push('/')
    }
    this.gotoPage(this.state.page)
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

          const pageNo = getTodayDayOfWeek() === 0
            ? this.state.flag ? 7 : FIRST_DAY_OTHER_WEEK
            : this.state.flag ? getTodayDayOfWeek() : FIRST_DAY_OTHER_WEEK
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
                  onDashboardClick={() => {
                    history.push("/dashboard")
                  }}
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
                  onDashboardClick={() => {
                    history.push("/dashboard")
                  }}
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
                  onDashboardClick={() => {
                    history.push("/dashboard")
                  }}
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
                  userId={this.apiModel.userId}
                  sendAssistantData={(action: AssistantSendAction) => this.assistant.sendAction(action)}
                  description={
                    this.state.character === 'joy'
                      ? ENTER_DATA_NO_OFFICIAL_TEXT
                      : ENTER_DATA_OFFICIAL_TEXT
                  }
                  character={this.state.character}
                  onDashboardClick={() => history.push("/dashboard")}
                  theme={this.state.theme}
                  toggleTheme={() => this.toggleTheme()}
                  dayPush={this.state.dayPush}
                  CheckIsCorrect={this.CheckIsCorrect}
                  LoadSchedule={() => this.Load_Schedule(true)}
                  apiModel={this.apiModel}
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
                    // currentLesson={this.apiModel.saved_schedule[this.state.page - 1]?.[match.params.lessonIndex - 1]?.[THIS_WEEK]}
                    currentLesson={this.apiModel.saved_schedule[this.state.page - 1]?.[match.params.lessonIndex - 1]}
                    currentLessonStartEnd={LessonStartEnd[match.params.lessonIndex]}
                    onGoToPage={(pageNo) => this.gotoPage(pageNo)}
                    pageNo={this.state.page}
                    onDashboardClick={() => history.push("/dashboard")}
                    handleTeacherChange={this.apiModel.handleTeacherChange}

                  />
                )
              }
            }
          />
          <Route
            path="/dashboard"
            render={
              ({match}) => {
                console.log("/dashboard: isSavedSchedule:", this.apiModel.isSavedSchedule)
                const now = new Date();
                let todayZeroIndex = getTodayDayOfWeek() - 1;
                let currentLessonIdx = this.getCurrentLesson(now);
                // let currentLesson = this.apiModel.saved_schedule[todayZeroIndex]?.[parseInt(currentLessonIdx) - 1]?.[THIS_WEEK];
                let currentLesson = this.apiModel.saved_schedule.current_week[todayZeroIndex]?.[parseInt(currentLessonIdx) - 1];
                let currentLessonStartEnd = LessonStartEnd[parseInt(currentLessonIdx) - 1]

                let nextLessonIdx = this.whatLesson(now, "will").num;
                // let nextLesson = this.apiModel.saved_schedule[todayZeroIndex]?.[nextLessonIdx - 1]?.[THIS_WEEK];
                let nextLesson = this.apiModel.saved_schedule[todayZeroIndex]?.[nextLessonIdx - 1];
                //console.log(this.whatLesson(now, "will").num, "next")
                console.log('/dashboard: getTodayDayOfWeek():', getTodayDayOfWeek())

                let count = this.apiModel.day.current_week[todayZeroIndex]?.count;
                //console.log("COUNT", this.state.today)
                // console.log('/dashboard: count:', count)

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
                  userId={this.apiModel.userId}
                  spinner={this.state.spinner}
                  currentLesson={currentLesson}
                  currentLessonStartEnd={currentLessonStartEnd}
                  nextLesson={nextLesson}
                  nextLessonStartEnd={nextLessonStartEnd}
                  onGoToPage={(pageNo) => this.gotoPage(pageNo)}
                  handleTeacherChange={this.apiModel.handleTeacherChange}
                  apiModel={this.apiModel}

                />
              }
            }/>
          <Route
            path="/home"
            render={
              ({match}) => {
                return <HomePage
                  assistant={this.assistant}
                  // state={this.state}
                  CheckIsCorrect={this.CheckIsCorrect}
                  LoadSchedule={this.Load_Schedule}
                  onHandleTeacherChange={this.apiModel.handleTeacherChange}
                  description={
                    this.state.character === 'joy'
                      ? ENTER_DATA_NO_OFFICIAL_TEXT
                      : ENTER_DATA_OFFICIAL_TEXT
                  }
                  character={this.state.character}
                  theme={this.state.theme}
                  onShowScheduleClick={() => {
                    history.push('/')
                  }}
                  apiModel={this.apiModel}
                />
              }
            }
          />
          <Route
            path="/start"
            render={
              ({match}) => {
                return <Start
                  character={this.state.character}
                  theme={this.state.theme}
                  isMobileDevice={detectDevice() === "mobile"}
                />
              }
            }
          />
          <Route path="*">
            {
              <SchedulePage
                timeParam={page}
                onSetValue={this.setValue}
                character={this.state.character}
                theme={this.state.theme}
                PreviousWeek={() => this.PreviousWeek(this.apiModel.isSavedSchedule)}
                CurrentWeek={() => this.CurrentWeek(this.apiModel.isSavedSchedule)}
                NextWeek={() => {this.NextWeek(this.apiModel.isSavedSchedule)}}
                getCurrentLesson={this.getCurrentLesson}
                groupName={this.apiModel.isSavedSchedule ? this.apiModel.user?.group : this.apiModel.unsavedUser?.group}
                apiModel={ this.apiModel}
                doSetTeacher = {this.doSetTeacher}
                
                weekParam={page > 7 ? 1 : 0}
                day={page > 7 ? this.apiModel.day.other_week : this.apiModel.day.current_week}
                spinner={this.state.spinner}
                today={getTodayDayOfWeek()}
                schedule={this.apiModel.isSavedSchedule ? this.apiModel.saved_schedule : this.apiModel.other_schedule}
                getIsCorrectTeacher={this.getIsCorrectTeacher}
              />
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}
