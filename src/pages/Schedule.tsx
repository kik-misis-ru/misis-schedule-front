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


  const FIRST_DAY_OTHER_WEEK = 8;

  
  interface ScheduleProps{
    timeParam: number
    onSetValue: (string, any) => void
    teacher: string
    groupName: string
    character: Character  | typeof CHAR_TIMEPARAMOY
    isTeacher: boolean
    teacher_star: boolean
    star: boolean
    PreviousWeek: () => void
    CurrentWeek: () => void
    NextWeek: () => void
    getCurrentLesson: (Date) =>string
    handleTeacherChange: () => Promise<void>
    weekParam: number
    day: IDayHeader[]
    spinner: boolean
    today: number
    days: IScheduleDays

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
        let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
        let _timeparam = props.timeParam
        if (props.timeParam > 7) {
            _timeparam -=7;
            weekParam = OTHER_WEEK
        }
        
        this.state = {
            timeParam : _timeparam,
            current : this.props.getCurrentLesson(new Date()),
            day_num : _timeparam - 1,
            index : _timeparam,
            page : this.props.weekParam === OTHER_WEEK ? FIRST_DAY_OTHER_WEEK : 0,
            formatDate : (weekDayShort, dateDdDotMm) => `${weekDayShort} ${dateDdDotMm}`,
            isTeacher : props.getIsCorrectTeacher,
            groupName : getFullGroupName(props.group, props.subGroup),
            weekParam: weekParam
        }

        // const groupName = getFullGroupName(this.state.group, this.state.subGroup);
    }

    onHandleChange(key: string, value: any): void {
        this.props.onSetValue(key, value);
      }

    render(){
     return <DeviceThemeProvider>
        <DocStyle/>
        {
          getThemeBackgroundByChar(this.props.character)
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
              onDashboardClick={() => this.onHandleChange("page", DASHBOARD_PAGE_NO)}
              // onNavigatorClick={() => this.setState({page: NAVIGATOR_PAGE_NO})}
            />

            <WeekSelect
              onPrevWeekClick={() => {
                this.onHandleChange("spinner",false);
                this.props.PreviousWeek();
                this.onHandleChange("flag", false)
                this.onHandleChange("page", FIRST_DAY_OTHER_WEEK)
              }}
              onThisWeekClick={() => {
                this.props.CurrentWeek();
                this.onHandleChange("flag", true)
                this.onHandleChange("page", SCHEDULE_PAGE_NO)
              }}
              onNextWeekClick={() => {
                this.onHandleChange("spinner", false);
                this.props.NextWeek();
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
              onSelect={(weekDayIndex) => this.onHandleChange("page", (
                weekDayIndex + this.state.page + (this.state.weekParam === OTHER_WEEK ? 0 : 1)
              ))}
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
              isSunday={this.state.timeParam == 7}
              // today={this.state.today}
              // validateTeacher={this.isCorrectTeacher}
              // onSetValue={this.setValue}
              onTeacherClick={async (teacherName) => {
                this.onHandleChange("teacher", teacherName);
                await this.props.handleTeacherChange();
              }}
            />

            <Spacer200/>

          </Container>
        </div>
      </DeviceThemeProvider>
      }
}

export default Schedule