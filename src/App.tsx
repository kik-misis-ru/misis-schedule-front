import React from "react";
import {Router, Route, Switch} from 'react-router';
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.css';
import {detectDevice} from '@sberdevices/plasma-ui/utils';
import {DeviceThemeProvider} from "@sberdevices/plasma-ui";

import number from './language-ru/Number';
import DayOfWeek from './language-ru/DayOfWeek';

import {
  getSchedulebyUserId,
} from "./lib/ApiHelper";
import ApiModel from "./lib/ApiModel";

import DashboardPage from './pages/DashboardPage';

import HomePage from './pages/HomePage';
import Contacts from './pages/Contacts';
import FAQ from './pages/FAQ';
import Start from './pages/Start';
import NavigatorPage from './pages/NavigatorPage';
import SchedulePage from './pages/SchedulePage';
import Settings from './pages/Settings';

import breaks from './data/breaks.json';


import "./themes/App.css";
import {Theme} from "./themes/Theme";
import {DocStyle, getThemeBackgroundByChar} from "./themes/tools";
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
  LESSON_EXIST,
  StartOrEnd,
  ThemeType,
  THEME_DARK,
  THEME_LIGHT,
  THIS_WEEK,
  TodayOrTomorrow,
} from './types/base.d'
import {
  formatDateWithDots,
  formatTimeHhMm,
  MS_IN_DAY,
} from './lib/datetimeUtils';
import {
  pairNumberToPairText
} from './language-ru/utils';


import Lesson from "./pages/Lesson";
import {AssistantWrapper} from './lib/AssistantWrapper';
import {lesson} from "./stories/consts";

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
  date: number
  character: CharacterId
  theme: ThemeType
  isUser: boolean
}

export class App extends React.Component<IAppProps, IAppState> {
  assistant: AssistantWrapper
  apiModel: ApiModel

  constructor(props: IAppProps) {
    super(props);
    this.apiModel = new ApiModel()
    this.getCurrentLesson = this.getCurrentLesson.bind(this);
    this.getIsCorrectTeacher = this.getIsCorrectTeacher.bind(this)
    console.log('constructor');
    history.push("/dashboard")
    this.state = {
      notes: [],
      page: INITIAL_PAGE,
      date: Date.now(),
      theme: THEME_DARK,
      character: CHAR_SBER,
      isUser: false,
    }
    this.assistant = new AssistantWrapper(this);
  }

  componentDidMount() {
    this.assistant.init();
    this.setState({page: getTodayDayOfWeek()})
  }

  //////////////////////////////////////////////////////////////////////////////

  handleAssistantCharacter(character: AssistantCharacter) {
    this.setState({
      character: character.id,
    });
  }

  async handleAssistantSub(userId: string) {
    this.apiModel = new ApiModel()
    await this.apiModel.fetchUser(userId)
    console.log("userId", userId)
    const user = this.apiModel.user;
    if (this.apiModel.userId != undefined && this.apiModel.userId != "") {

      const userSchedule = await getSchedulebyUserId(userId)

      if (userSchedule) {
        this.apiModel.pushSettings = {
          IsActive: userSchedule.isActive,
          Hour: userSchedule.hour,
          Minute: userSchedule.minute,
        }
      }

      await this.apiModel.getSchedulebyUserId()
      let date = new Date()
      date.setDate(date.getDate() + 7)
      history.push("/dashboard")

      // Проверяем, сохранен ли пользователь
      if (!this.apiModel.isSavedUser) {
        console.log("handleAssistantSub: first time")
        await this.apiModel.createUser()


        history.push('/start')

        // Проигрываем начальное приветствие
        this.assistant.sendHello()

        // Создаем пользователя в базе данных с текущими настройками

      }
      this.setState({isUser: true});
    }
  }

  handleAssistantPageChange(pageRoute: string) {
    history.push(pageRoute)
  }

  async handleAssistantForDayOffset(offset: 0 | 1) {
    if (this.apiModel.CheckGroupOrTeacherSetted()) {
      const isSunday = (
        getTodayDayOfWeek() + offset === 0 ||
        getTodayDayOfWeek() + offset === 7
      );
      if (isSunday) {
        this.assistant.sendTodaySchedule(DAY_SUNDAY);
        return this.ChangePage(true);

      } else {
        offset == 0
          ? this.assistant.sendTodaySchedule(DAY_NOT_SUNDAY)
          : this.assistant.sendTomorrowSchedule(DAY_NOT_SUNDAY)
        return this.ChangePage(true);
      }
    }
  }

  async handleAssistantWhenLesson(
    type1: StartOrEnd,
    day1: TodayOrTomorrow,
    lessonNum: string,   // порядковый номер пары
  ) {
    if (this.apiModel.CheckGroupOrTeacherSetted()) {
      let params: AssistantSendActionSay['parameters'];
      const dayOfWeekZeroIndex = day1 === DAY_TODAY
        ? getTodayDayOfWeek()
        : getTodayDayOfWeek() + 1;
      let startEndLesson = this.getStartEndLesson(type1, dayOfWeekZeroIndex, lessonNum)

      if (startEndLesson !== undefined && startEndLesson[1] === DAY_SUNDAY) {
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
      let date = new Date().toISOString().slice(0, 10)
      if ((params.day === DAY_TODAY) && (getTodayDayOfWeek() !== 0)) {
        this.setState({page: getTodayDayOfWeek() - 1})
        return this.ChangePage(true);

      } else if (getTodayDayOfWeek() + 1 === 7) {
        return this.ChangePage(true);

      } else {
        this.setState({page: getTodayDayOfWeek()})
        return this.ChangePage(true);
      }
    }
  }

  async handleAssistantHowMany(date: Date | undefined, dayOfWeek: number | undefined) {
    console.log('handleAssistantHowMany: date', date, 'dayOfWeek:', dayOfWeek)

    let day: TodayOrTomorrow | undefined;
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
      await this.apiModel.getScheduleFromDb(date, true, false)
      const lessonCount = this.getLessonsCountForDate(date)
      let groupApiModel = this.apiModel.user?.group == undefined ? "" : this.apiModel.user.group
      if (groupApiModel !== "" && lessonCount > 0) {
        const lessonText = pairNumberToPairText(lessonCount);
        const dayOfWeekIndex = date.getDay();
        const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekIndex]?.toLowerCase();

        assistantParams = {
          day: day,
          lesson: lessonText,
          dayName: dayOfWeekLongPrepositional,
          amount: number.cardinal.fem[lessonCount]
        }
        this.setState({page: dayOfWeekIndex})
        if (dayOfWeekIndex < getTodayDayOfWeek()) {
          this.ChangePage(false);
        } else {
          this.ChangePage(true)
        }

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

      if ((this.apiModel.isSavedUser && this.apiModel.user?.group_id != "") || (this.apiModel.isSavedUser && this.apiModel.unsavedUser?.group_id != "")) {
        this.setState({page: getTodayDayOfWeek() - 1})
        this.ChangePage(true);
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
        this.ChangePage(true);
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
      this.ChangePage(true);
    }
  }

  handleAssistantFirstLesson(dayOfWeek: number) {
    if (this.apiModel.CheckGroupOrTeacherSetted()) {

      let firstLessonNumStr: string;
      let day1: undefined | TodayOrTomorrow = DAY_TODAY;

      const dayOfWeekZeroIndex = dayOfWeek - 1
      console.log('dispatchAssistantAction: first_lesson:', dayOfWeek)
      firstLessonNumStr = this.getStartFirstLesson(dayOfWeekZeroIndex)[1]

      if (firstLessonNumStr === undefined) {
        console.warn('dispatchAssistantAction: firstLessonNumStr is undefined')
      }

      if (getTodayDayOfWeek() === dayOfWeek - 1) {
        day1 = DAY_TODAY;

      } else if (getTodayDayOfWeek() + 1 === dayOfWeek - 1) {
        day1 = DAY_TOMORROW;

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
      this.setState({page: dayOfWeek})
      if (dayOfWeekZeroIndex < getTodayDayOfWeek()) {

        this.ChangePage(false)
      } else this.ChangePage(true)

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

      this.setState({page: dayOfWeek - 1})
      if (note1 === null && note2 === null) {
        console.log('dispatchAssistantAction: day_schedule: isCurrentWeek:',);
        this.ChangePage(true)
      } else {
        console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', dayOfWeekZeroIndex);

        if (note1 !== null) {
          console.log('dispatchAssistantAction: day_schedule: note[1]:', note1);
          this.ChangePage(true)

        } else if (note2 !== null) {
          console.log('dispatchAssistantAction: day_schedule: note[2]:', note2);
          this.ChangePage(false)

        }
      }
      console.log('dispatchAssistantAction: day_schedule: dayOfWeekZeroIndex:', dayOfWeekZeroIndex, this.state.page)

      const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekZeroIndex]?.toLowerCase();

      this.assistant.sendSay6(dayOfWeekLongPrepositional);


    }
  }

  async handleAssistantShowSchedule(actionNote: string | undefined) {

    if (String(history.location.pathname).toLocaleLowerCase().includes(HOME_PAGE_ROUTE)) {
      return
    }
    console.log('dispatchAssistantAction: show schedule', actionNote);
    if (actionNote) {

      const isStudent = !actionNote.includes("препод")
      if (isStudent) {
        history.push('/home/true')
      } else {
        history.push('/home/false')
      }
      this.assistant.sendChangeGroup(isStudent);

    } else {
      let success = true;

      if (success) {
        await this.apiModel.LoadSchedule(this.apiModel.isSavedSchedule)
        let current_date = new Date().toISOString().slice(0, 10)
        history.push('/schedule/' + current_date + '/' + true + '/' + true)
      }

    }
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
    const lesson = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule : this.apiModel.other_schedule
    if (dayNumber < getTodayDayOfWeek()) {
      for (let lessonIdx in lesson.other_week[dayNumber - 1]) {
        if (lesson.other_week[dayNumber - 1][lessonIdx].lessonName !== "") {
          lessonsStart = LessonStartEnd[Number(lessonIdx)].start
          console.log('getStartFirstLesson: lessonIdx:', lesson.other_week[dayNumber - 1][lessonIdx].lessonName)
          lessonNumber = String(Number(lessonIdx) + 1);
          break
        }
      }
    } else {
      for (let lessonIdx in lesson.current_week[dayNumber - 1]) {
        if (lesson.current_week[dayNumber - 1][lessonIdx].lessonName !== "") {
          lessonsStart = LessonStartEnd[Number(lessonIdx)].start
          console.log('getStartFirstLesson: lessonIdx:', lessonIdx, lesson.current_week[dayNumber - 1][lessonIdx].lessonName)
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
    console.log("todayOrTomorrow", todayOrTomorrow)
    const lesson = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule : this.apiModel.other_schedule
    console.log("Lesson", lesson)
    for (let lessonIdx in lesson.current_week[todayOrTomorrow]) {
      if (lesson.current_week[todayOrTomorrow][lessonIdx].lessonName !== "") {
        lessonEnd = LessonStartEnd[lessonIdx].end;
      }
    }
    return lessonEnd;
  }

  // определяет начало или конец энной пары сегодня или завтра
  getBordersRequestLesson(startOrEnd: StartOrEnd, dayOfWeekIndex: number, lessonNum: number): string | undefined {

    const lessonName = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule.current_week[dayOfWeekIndex][lessonNum - 1].lessonName : this.apiModel.other_schedule.current_week[dayOfWeekIndex][lessonNum - 1].lessonName

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
          return this.getEndLastLesson(dayOfWeekIndex - 1)
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
    let current_week = this.apiModel.day.current_week
    let other_week = this.apiModel.day.other_week
    for (let i = 0; i < 6; i++) {
      console.log("strDate:", strDate, ", other week date", other_week[i].date)
      if (strDate === other_week[i].date) {
        return other_week[i].count
      }
      console.log("strDate:", strDate, ", current week date", current_week[i].date)
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
      const day = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule.current_week[todayIndex] : this.apiModel.other_schedule.current_week[todayIndex]
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
    const day = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule.current_week[todayDayOfWeek - 1] : this.apiModel.other_schedule.current_week[todayDayOfWeek - 1]
    if ((todayDayOfWeek !== 0) && (todayDayOfWeek + 1 !== 7))
      for (let bell in day) {
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
    lesson: string,
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
    const todayLessons = Boolean(this.apiModel.isSavedSchedule) ? this.apiModel.saved_schedule?.current_week[todayWorkDayZeroIndex] : this.apiModel.other_schedule?.current_week[todayWorkDayZeroIndex]


    const NO_LESSON = {
      lesson: '',
      type: when,
      num: -1,
    }

    let result = NO_LESSON;

    if (isSunday) {
      result = NO_LESSON
      console.log(`whatLesson: isSunday: result:`, result)
      return result;

    } else {
      console.log('whatLesson: count:', todayBells.count[THIS_WEEK]);
      const firstLessonTimeHhMm = this.getStartFirstLesson(todayWorkDayZeroIndex + 1)[0];

      console.log("whatLesson: что за пара", formatTimeHhMm(date), when, firstLessonTimeHhMm);
      const currLessonNum = this.getCurrentLesson(date);

      if (
        (when === "now") &&
        (currLessonNum !== undefined)
      ) {
        for (let bellIdx in todayLessons) {
          const lesson = todayLessons[bellIdx];

          if (
            (lesson.lessonNumber === currLessonNum) &&
            (lesson.lessonNumber !== "")
          ) {
            result = {
              lesson: lesson.lessonName,
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

        for (let bell in todayLessons) {
          const lesson = todayLessons[bell];

          if (
            (lesson && lesson.lessonNumber == String(parseInt(currLessonNum) + 1)) &&
            (lesson.lessonNumber !== "")
          ) {
            console.log("whatLesson: будет", todayLessons[bell])
            result = {
              lesson: lesson.lessonName,
              type: "next",
              num: parseInt(currLessonNum) + 1
            };
          }
        }
      } else if (
        (firstLessonTimeHhMm !== undefined) &&
        (firstLessonTimeHhMm >= formatTimeHhMm(date))
      ) {
        const firstLessonInfo = this.getStartFirstLesson(todayWorkDayZeroIndex + 1)
        console.log('whatLesson:', firstLessonInfo[1], this.getStartFirstLesson(todayWorkDayZeroIndex + 1)[0]);

        const lessonNumber = parseInt(firstLessonInfo[1]);
        result = {
          lesson: todayLessons[lessonNumber].lessonName,
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
            (todayLessons !== undefined) &&
            (todayLessons[i].lessonName !== undefined)
          ) {

            result = {
              lesson: todayLessons[i].lessonName,
              type: "will",
              num: parseInt(i)
            };
          } else {
            result = NO_LESSON;
          }
        }
      }
    }
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
      const lessonCount = this.getLessonsCountForDate(date);
      const todayLessons = Boolean(this.apiModel.isSavedSchedule)
        ? this.apiModel.saved_schedule?.current_week[todayDayOfWeek - 1]
        : this.apiModel.other_schedule?.current_week[todayDayOfWeek - 1]
      if (lessonCount <= 0) {
        return {
          exist: "empty",
        }
      }
      if (numberNearestLesson !== undefined) {
        for (let bell in todayLessons) {
          // если пара с таким номером есть в расписании
          if (todayLessons[bell].lessonNumber === numberNearestLesson) {
            return {
              audience: todayLessons[bell].room,
              type: "nearest",
              exist: "inSchedule",
            }
          } else {
            // сообщаем, что такой пары нет
            console.log(`whereWillLesson: Сейчас перерыв. Ближайшей будет ${numberNearestLesson} пара`)

            for (let bell in todayLessons) {
              if (todayLessons[bell].lessonNumber !== numberNearestLesson) {
                return {
                  audience: todayLessons[bell].room,
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
        for (let bell in todayLessons) {
          if (todayLessons[bell].lessonNumber === this.getCurrentLesson(date)) {
            whereCurrentLesson = todayLessons[bell].room
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
        for (let bell in todayLessons) {
          if (todayLessons[bell].lessonNumber === String(Number(this.getCurrentLesson(date)) + 1)) {
            nextLessonRoom = todayLessons[bell].room
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


  ChangePage(IsCurrentWeek: boolean) {
    let date
    if (IsCurrentWeek) {
      date = new Date().toISOString().slice(0, 10)
    } else {
      let _date = new Date()
      _date.setDate(_date.getDate() + 7)
      date = _date.toISOString().slice(0, 10)
    }

    let IsSave = this.apiModel.isSavedSchedule
    console.log("current_date+'/'+IsSave+'/'+IsCurrentWeek+page", date, IsSave, IsCurrentWeek, this.state.page)
    history.push('/schedule/' + date + '/' + IsSave + '/' + IsCurrentWeek)
  }


  toggleTheme() {
    console.log('toggleTheme:', this.state.theme)
    const theme = this.state.theme === THEME_DARK
      ? THEME_LIGHT
      : THEME_DARK;
    this.setState({theme})
  }


  render() {
    let {page} = this.state;
    console.log("App: render, this.state:", this.state)
    return (
      <Theme
        // assistant={this.assistant}
        character={this.state.character}
        theme={this.state.theme}
      >
        <Router history={history}>
          <Switch>
            <Route path="/contacts" render={
                ({match}) => {
                  return <Contacts/>
                }                           
              }/>
            <Route path="/faq" render={
                ({match}) => {
                  return <FAQ
                  />
                }                           
              }/>
            <Route
              path="/navigation"
              render={
                ({match}) => {
                  return <NavigatorPage
                    isMobileDevice={detectDevice() === "mobile"}
                  />
                }                           
              }
            />                            
            <Route
              path="/settings"
              render={
                ({match}) => {
                  return <Settings
                    apiModel={this.apiModel}
                    assistant={this.assistant}
                    description={
                      this.state.character === 'joy'
                        ? ENTER_DATA_NO_OFFICIAL_TEXT
                        : ENTER_DATA_OFFICIAL_TEXT
                    }
                    toggleTheme={() => this.toggleTheme()}
                  />
                }
              }
            />

            <Route
              path="/dashboard"
              render={
                ({match}) => {
                  // console.log("/dashboard: isSavedSchedule:", this.apiModel.isSavedSchedule)
                  const now = new Date();
                  let todayZeroIndex = getTodayDayOfWeek() - 1;
                  let currentLessonIdx = this.getCurrentLesson(now);
                  let currentLesson = this.apiModel.saved_schedule.current_week[todayZeroIndex]?.[parseInt(currentLessonIdx) - 1];
                  let currentLessonStartEnd = LessonStartEnd[parseInt(currentLessonIdx) - 1]

                  let nextLessonIdx = this.whatLesson(now, "will").num;
                  let nextLesson = this.apiModel.saved_schedule.current_week[todayZeroIndex]?.[nextLessonIdx - 1];
                  // console.log(this.whatLesson(now, "will").num, "next")
                  // console.log('/dashboard: getTodayDayOfWeek():', nextLesson);
                  let count = this.apiModel.day.current_week[todayZeroIndex]?.count;
                  let nextLessonStartEnd = LessonStartEnd[nextLessonIdx - 1];
                  let start = this.getStartFirstLesson(todayZeroIndex + 1)[0];
                  let end = this.getEndLastLesson(todayZeroIndex);
                  // console.log("this.state.isUser", this.state.isUser)
                  return <DashboardPage
                    assistant={this.assistant}
                    isTeacherAndValid={this.getIsCorrectTeacher()}
                    start={start}
                    end={end}
                    count={count}
                    currentLesson={currentLesson}
                    currentLessonStartEnd={currentLessonStartEnd}
                    nextLesson={nextLesson}
                    nextLessonStartEnd={nextLessonStartEnd}
                    apiModel={this.apiModel}
                    isUser={this.state.isUser}
                  />
                }
              }/>
            <Route
              path="/home/:IsStudent"
              render={
                ({match}) => {
                  return <HomePage
                    assistant={this.assistant}
                    IsStudent={match.params.IsStudent == "true"}
                    description={
                      this.state.character === 'joy'
                        ? ENTER_DATA_NO_OFFICIAL_TEXT
                        : ENTER_DATA_OFFICIAL_TEXT
                    }
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
                    assistant={this.assistant}
                    isMobileDevice={detectDevice() === "mobile"}
                  />
                }
              }
            />
            <Route
              path="/schedule/:Date/:IsSaved/:IsCurrentWeek/:Day?"
              render={
                ({match}) => {
                  return <SchedulePage
                    page={match.params.Day
                      ? Number(match.params.Day)
                      : new Date().getDay() - 1}
                    assistant={this.assistant}
                    timeParam={this.state.page}
                    getCurrentLesson={this.getCurrentLesson}
                    apiModel={this.apiModel}
                    Date={new Date(match.params.Date)}
                    IsSavedSchedule={match.params.IsSaved == "true"}
                    IsCurrentWeek={match.params.IsCurrentWeek == "true"}
                    day={page > 7 ? this.apiModel.day.other_week : this.apiModel.day.current_week}
                    today={getTodayDayOfWeek()}
                    // schedule={this.apiModel.isSavedSchedule ? this.apiModel.saved_schedule : this.apiModel.other_schedule}
                    getIsCorrectTeacher={this.getIsCorrectTeacher}
                  />
                }
              }
            />
            <Route
              path="/lesson/:IsSaved/:IsCurrentWeek/:Day/:lessonIndex"
              render={
                ({match}) => {
                  // console.log("/lesson/:IsSaved/:IsCurrentWeek/:Day/:lessonIndex", match.params.IsSaved, match.params.IsCurrentWeek, Number(match.params.Day), Number(match.params.lessonIndex))
                  // temporary workaround
                  let lesson = String(match.params.IsSaved) == "true" ? this.apiModel.saved_schedule : this.apiModel.other_schedule
                  let lessonWeek = String(match.params.IsCurrentWeek) == "true" ? lesson.current_week : lesson.other_week

                  // console.log("/lesson/...: this.state.page:", this.state.page)
                  // console.log("/lesson/...: this.apiModel.saved_schedule[this.state.page - 1]?.[match.params.lessonIndex - 1]", this.apiModel.saved_schedule.current_week)
                  // if (this.state.page!==NON_EXISTING_PAGE_NO) this.gotoPage(NON_EXISTING_PAGE_NO);
                  return (
                    <Lesson
                      isTeacherAndValid={this.getIsCorrectTeacher()}
                      currentLesson={lessonWeek[Number(match.params.Day)]?.[Number(match.params.lessonIndex) - 1]}
                      currentLessonStartEnd={LessonStartEnd[Number(match.params.lessonIndex)]}
                      pageNo={Number(match.params.Day)}
                      apiModel={this.apiModel}
                    />
                  )
                }
              }
            />
          </Switch>
        </Router>
      </Theme>
    )
  }
}
