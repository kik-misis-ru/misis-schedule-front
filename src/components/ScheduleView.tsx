import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import {Container} from '@sberdevices/plasma-ui';

import ScheduleDay from "./ScheduleDay";
import TopMenu from './TopMenu';
import WeekCarousel from "./WeekCarousel";
import WeekSelect from "./WeekSelect";
import {
  history,
} from '../App'
import ApiModel, {IScheduleDays} from "../lib/ApiModel"
import {Spacer100,Spacer200,Spacer300} from './Spacers'
import {
  IDayHeader,
  OTHER_WEEK,
  THIS_OR_OTHER_WEEK,
  THIS_WEEK,
} from '../types/base.d'
import {
  formatFullGroupName,
} from '../lib/formatters';


const FIRST_DAY_OTHER_WEEK = 8;


export interface ScheduleViewProps {
  apiModel: ApiModel
  timeParam: number
  groupName: string | undefined
  onSetValue: (string, any) => void
  PreviousWeek: () => void
  CurrentWeek: () => void
  NextWeek: () => void
  getCurrentLesson: (Date) => string
  weekParam: number
  day: IDayHeader[]
  spinner: boolean
  today: number
  schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  doSetTeacher: (string) => Promise<void>
  getIsCorrectTeacher: () => boolean
}

interface ScheduleViewState {
  day_num: number
  current: string
  index: number
  page: number
  formatDate: (weekDayShort: string, dateDdDotMm: string) => string
  isTeacher: boolean
  groupName: string
  weekParam: number
  timeParam: number
  teacher: string
}

export class ScheduleView extends React.Component<ScheduleViewProps, ScheduleViewState> {

  constructor(props) {
    super(props);
    this.onHandleChange = this.onHandleChange.bind(this)
    this.PreviousWeek = this.PreviousWeek.bind(this)
    this.NextWeek = this.NextWeek.bind(this);
    this.CurrentWeek = this.CurrentWeek.bind(this);
  }


  PreviousWeek() {
    this.props.PreviousWeek()
  }

  NextWeek() {
    this.props.NextWeek()
  }

  CurrentWeek() {
    this.props.CurrentWeek();
  }

  onHandleChange(key: string, value: any): void {
    this.props.onSetValue(key, value);
  }


  render() {

    let weekParam: THIS_OR_OTHER_WEEK = THIS_WEEK;
    let _timeparam = this.props.timeParam
    if (this.props.timeParam > 7) {
      _timeparam -= 7;
      weekParam = OTHER_WEEK
    }


    const getIsCorrectTeacher = () => {
      return this.props.getIsCorrectTeacher()
    }

    let apiModel =this.props.apiModel;
    //let groupName = apiModel.isSavedUser ? apiModel.user?.group : apiModel.unsavedUser?.group
    let subGroupName = apiModel.isSavedUser ? apiModel.user?.subgroup_name : apiModel.unsavedUser?.subgroup_name
    let teacher =this.props.apiModel.isSavedUser? this.props.apiModel.user?.teacher : this.props.apiModel.unsavedUser?.teacher
    if(teacher == undefined){
      teacher = ""
    }
    
    this.state = {
      timeParam: _timeparam,
      current: this.props.getCurrentLesson(new Date()),
      day_num: _timeparam - 1,
      index: _timeparam,
      page: this.props.weekParam === OTHER_WEEK ? FIRST_DAY_OTHER_WEEK : 0,
      formatDate: (weekDayShort, dateDdDotMm) => `${weekDayShort} ${dateDdDotMm}`,
      isTeacher: getIsCorrectTeacher(),
      groupName: formatFullGroupName(this.props.groupName ? this.props.groupName : "", subGroupName ? subGroupName : ""),
      weekParam: weekParam,
      teacher : teacher
      
      
    }

    console.log('ScheduleView: spinner:', this.props.spinner)
    console.log('ScheduleView: schedule', this.props.schedule)

    return (
 /*     <DeviceThemeProvider>
      <DocStyle/>
      {
        getThemeBackgroundByChar(this.props.character, this.props.theme)
      }
  */
      <div>
        <Container style={{
          padding: 0,
          //  overflow: "scroll",
          minHeight: '100%',
        }}>
          <TopMenu
            subLabel={
              !this.props.apiModel.isStudent
                ? this.state.teacher
                : 
                //this.props.groupName
               this.state.groupName
            }
            onHomeClick={() => history.push('/home')}
            onDashboardClick={async () => {

              if (this.props.apiModel.unsavedUser) {
                await this.props.apiModel.getScheduleFromDb(Number(new Date()), true, true);
              }
              this.onHandleChange("isSavedSchedule", true)
              history.push("/dashboard")
            }}
            Bd={() =>this.props.apiModel.getScheduleFromDb(Number(new Date()), true, true)}
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
              history.push('/spinner')
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
                const dateDdDotMmDotYy = date;
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
              this.state.weekParam == 0 ? this.props.schedule.current_week[this.state.day_num] : this.props.schedule.other_week[this.state.day_num]
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
            onTeacherClick={async (teacherName) => {
              await this.props.doSetTeacher(teacherName)
            }
          }
          />

          <Spacer200/>

        </Container>
      </div>
/*
    </DeviceThemeProvider>
*/
  )
  }
}

export default ScheduleView
