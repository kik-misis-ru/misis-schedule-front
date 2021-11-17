import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";
import {Container, DeviceThemeProvider} from '@sberdevices/plasma-ui';
import ScheduleDay from "../components/ScheduleDay";
import TopMenu from '../components/TopMenu';
import WeekCarousel from "../components/WeekCarousel";
import WeekSelect from "../components/WeekSelect";

import {IScheduleDays, 
    Spacer200, 
    HOME_PAGE_NO,
    DASHBOARD_PAGE_NO,
    SCHEDULE_PAGE_NO
} from '../App'

import {DocStyle, getThemeBackgroundByChar} from "../themes/tools";


import {
    Character,
    IDayHeader,
    OTHER_WEEK,
    THIS_OR_OTHER_WEEK,
    CHAR_TIMEPARAMOY,
    THIS_WEEK,
  } from '../types/base.d'

  import {
    getFullGroupName,
  } from '../utils';
import { threadId } from "worker_threads";


  const FIRST_DAY_OTHER_WEEK = 8;

  
  interface ScheduleProps{
    timeParam: number
    onSetValue: (string, any) => void
    teacher: string
    groupName: string
    character: Character  | typeof CHAR_TIMEPARAMOY
    isTeacher: boolean
    teacher_star: boolean
    bd: string
    teacher_bd: string
    star: boolean
    theme: string
    PreviousWeek: () => void
    CurrentWeek: () => void
    NextWeek: () => void
    getCurrentLesson: (Date) =>string
    doSetTeacher: (teacherName: string) => void
    weekParam: number
    day: IDayHeader[]
    spinner: boolean
    today: number
    days: IScheduleDays
    group: string
    subGroup: string
    getIsCorrectTeacher: () => boolean
    Bd: () => void
    //Load_Schedule: () => void

  }

  interface ScheduleState{
    day_num: number
    current: string
    index: number
    page: number
    formatDate: (weekDayShort : string, dateDdDotMm: string) => string
    isTeacher: boolean
    groupName: string
    weekParam: number
    timeParam: number
  }

class  Schedule extends React.Component<ScheduleProps, ScheduleState>{

    constructor(props) {
        super(props);
        this.onHandleChange = this.onHandleChange.bind(this)
        this.PreviousWeek = this.PreviousWeek.bind(this)
        this.NextWeek = this.NextWeek.bind(this);
        this.CurrentWeek = this.CurrentWeek.bind(this);
        this.Bd = this.Bd.bind(this);
        //this.Load_Schedule = this.Load_Schedule.bind(this)
        // const groupName = getFullGroupName(this.state.group, this.state.subGroup);
    }
     async Bd(){
      await this.props.Bd()
    }
    PreviousWeek(){
        this.props.PreviousWeek()
    }
    NextWeek(){
        this.props.NextWeek()
    }
    CurrentWeek(){
        this.props.CurrentWeek();
    }

    onHandleChange(key: string, value: any): void {
        this.props.onSetValue(key, value);
      }
    

      
      
    render(){
      
      let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
      let _timeparam = this.props.timeParam
      if (this.props.timeParam > 7) {
          _timeparam -=7;
          weekParam = OTHER_WEEK
      }


      const getIsCorrectTeacher =() => {
        return this.props.getIsCorrectTeacher()
      }
      
      this.state = {
          timeParam : _timeparam,
          current : this.props.getCurrentLesson(new Date()),
          day_num : _timeparam - 1,
          index : _timeparam,
          page : this.props.weekParam === OTHER_WEEK ? FIRST_DAY_OTHER_WEEK : 0,
          formatDate : (weekDayShort, dateDdDotMm) => `${weekDayShort} ${dateDdDotMm}`,
          isTeacher : getIsCorrectTeacher(),
          groupName : getFullGroupName(this.props.group, this.props.subGroup),
          weekParam: weekParam
      }

      console.log(this.props.spinner, "SPINNER")
      
     return <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.props.character, this.props.theme)
        }
        <div>
          <Container style={{padding: 0, overflow: "hidden"}}>

            <TopMenu
              subLabel={
                this.props.isTeacher
                  ? this.props.teacher
                  : this.props.groupName
              }
              starred={
                this.props.isTeacher
                  ? this.props.teacher_star
                  : this.props.star
              }
              onStarClick={() => {
              }}
              onHomeClick={() => this.onHandleChange("page", HOME_PAGE_NO)}
              onDashboardClick={async () => {
                if (!this.props.isTeacher&&this.props.groupName!=this.props.bd||this.props.isTeacher&&this.props.teacher!=this.props.teacher_bd)
                await this.Bd();
                this.onHandleChange("page", DASHBOARD_PAGE_NO);
              }}
              Bd={()=> this.Bd()}
              //Load_Schedule={()=> this.Load_Schedule()}
              // onNavigatorClick={() => this.setState({page: NAVIGATOR_PAGE_NO})}
            />

           <WeekSelect
             onPrevWeekClick={() => {
               this.onHandleChange("spinner", false);
               this.PreviousWeek();
               this.onHandleChange("flag", false)
               this.onHandleChange("page", FIRST_DAY_OTHER_WEEK)
             }}
             onThisWeekClick={() => {
               this.CurrentWeek();
               this.onHandleChange("flag", true)
               this.onHandleChange("page", SCHEDULE_PAGE_NO)
             }}
             onNextWeekClick={() => {
               this.onHandleChange("spinner", false);
               this.NextWeek();
               this.onHandleChange("flag", false)
               this.onHandleChange("page", FIRST_DAY_OTHER_WEEK)
             }}
           />

            <WeekCarousel
              selectedIndex={this.state.index - 1}
              markedIndex={this.state.weekParam === THIS_WEEK ? this.props.today - 1 : -1 /* current weekday can't be on 'other' week*/}
              cols={
                this.props.day.map(d => {
                  const {title, date} = d;
                  const weekDayShort = title;
                  const dateDdDotMmDotYy = date[this.state.weekParam];
                  const dateDdDotMm = dateDdDotMmDotYy.slice(0, 5);
                  return dateDdDotMm
                    ? this.state.formatDate(weekDayShort, dateDdDotMm)
                    : '';
                })
              }
              onSelect={(weekDayIndex) => {
                this.onHandleChange("page", (
                    weekDayIndex + this.state.page + (this.state.weekParam === OTHER_WEEK ? 0 : 1)
                  ))
              }}
            />

            <ScheduleDay
              isReady={this.props.spinner}
              // days={this.state.days}
              // day_num={day_num}
              dayLessons={
                this.props.days[this.state.day_num]?.map(bellsThisOrOtherWeek => bellsThisOrOtherWeek[this.state.weekParam])
              }
              currentLessonNumber={this.state.current}
              // weekParam={weekParam}
              // timeParam={timeParam}
              isTeacherAndValid={this.state.isTeacher}
              isToday={this.props.today === this.state.timeParam && this.props.weekParam === THIS_WEEK}
              isDayOff={this.state.timeParam == 7}
              // today={this.state.today}
              // validateTeacher={this.isCorrectTeacher}
              // onSetValue={this.setValue}
              onTeacherClick={async (teacherName) => this.props.doSetTeacher(teacherName)}
            />

            <Spacer200/>

          </Container>
        </div>
      </DeviceThemeProvider>
      }
}

export default Schedule
