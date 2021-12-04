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
import {AssistantWrapper} from "../lib/AssistantWrapper"
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

const DAY_IN_SECONDS = 86400


export interface ScheduleViewProps {
  apiModel: ApiModel
  timeParam: number
  getCurrentLesson: (Date) => string
  day: IDayHeader[]
  today: number
  schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  getIsCorrectTeacher: () => boolean
  Date: Date
  IsSavedSchedule: boolean
  IsCurrentWeek: boolean
  assistant: AssistantWrapper
}

interface ScheduleViewState {
  current: string
  formatDate: (weekDayShort: string, dateDdDotMm: string) => string
  isTeacher: boolean
  groupName: string
  teacher: string
  schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  Day: number
}

export class ScheduleView extends React.Component<ScheduleViewProps, ScheduleViewState> {


  componentDidMount() {
    this.props.assistant.on('for_this_week', () => {
      this.CurrentWeek()
    })
    this.props.assistant.on('for_next_week', () => {
      this.NextWeek()
    })
    
  }


  constructor(props) {
    super(props);
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
    let subGroupName = this.props.IsSavedSchedule ? apiModel.user?.subgroup_name : apiModel.unsavedUser?.subgroup_name
    let teacher =this.props.IsSavedSchedule? this.props.apiModel.user?.teacher : this.props.apiModel.unsavedUser?.teacher
    if(teacher == undefined){
      teacher = ""
    }
    let schedule = this.props.IsSavedSchedule ? this.props.apiModel.saved_schedule : this.props.apiModel.other_schedule
    let groupName = this.props.IsSavedSchedule ? this.props.apiModel.user?.group : this.props.apiModel.unsavedUser.group

    this.state = {
      current: this.props.getCurrentLesson(new Date()),
      formatDate: (weekDayShort, dateDdDotMm) => `${weekDayShort} ${dateDdDotMm}`,
      isTeacher: getIsCorrectTeacher(),
      groupName: formatFullGroupName(groupName ? groupName : "", subGroupName ? subGroupName : ""),
      teacher : teacher,
      schedule: schedule,
      Day: this.props.timeParam
    }
    console.log("this.state.teacher", this.state.teacher, this.props.apiModel.isStudent)
   
  }
  PreviousWeek(){
    this.props.apiModel.isSchedule = false;
              let date = this.props.Date
              date.setDate(date.getDate() - 7)
              let date_to_url = date.toISOString().slice(0,10)
              history.push('/schedule/'+date_to_url+'/'+this.props.IsSavedSchedule+'/'+false)
  }
  CurrentWeek(){
    let current_date = new Date().toISOString().slice(0,10)
              history.push('/schedule/'+current_date+'/'+this.props.IsSavedSchedule+'/'+true)
  }
  NextWeek(){
    this.props.apiModel.isSchedule = false;
              let date = this.props.Date
              date.setDate(date.getDate() +7)
              let date_to_url = date.toISOString().slice(0,10)
              history.push('/schedule/'+date_to_url+'/'+this.props.IsSavedSchedule+'/'+false)
  }

  render() {
    const {schedule } = this.props;
    let teacherName =this.props.IsSavedSchedule? this.props.apiModel.user?.teacher : this.props.apiModel.unsavedUser?.teacher
    console.log("ScheduleView: render: schedule", schedule)
    let teacher = teacherName == undefined ?  "" :  teacherName
    let isReady = this.props.apiModel.isSchedule
  
    console.log("isReady", isReady);
    console.log('Day', this.state.Day)
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
                ? teacher
                : 
                //this.props.groupName
               this.state.groupName
            }
            onHomeClick={() => history.push('/home')}
            onDashboardClick={async () => {

              if (this.props.apiModel.unsavedUser) {
                await this.props.apiModel.getScheduleFromDb(new Date(), true, true);
              }
              history.push('/dashboard')
            }}
            Bd={() =>this.props.apiModel.getScheduleFromDb(new Date(), true, true)}
          />

          <WeekSelect
            onPrevWeekClick={async () => {
              this.PreviousWeek()
            }}
            onThisWeekClick={() => {
              this.CurrentWeek()
            }}
            onNextWeekClick={async () => {
              this.NextWeek()
            }}
          />

          <WeekCarousel
            selectedIndex={this.state.Day}
            markedIndex={this.props.IsCurrentWeek  ? this.props.today - 1 : -1 /* current weekday can't be on 'other' week*/}
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
              this.setState({Day:  weekDayIndex});
            }}
          />

          <ScheduleDay
            isReady={isReady}
            dayLessons={
              String(this.props.IsCurrentWeek)=="true"
                ? schedule.current_week[this.state.Day]
                : schedule.other_week[this.state.Day]
            }
            currentLessonNumber={this.state.current}
            isTeacherAndValid={this.state.isTeacher}
            isToday={this.props.today === this.state.Day && this.props.IsCurrentWeek}
            isDayOff={this.state.Day == 7}
            onTeacherClick={async (teacherName) => {
              
              await this.props.apiModel.doSetTeacher(teacherName)
              let current_date = new Date().toISOString().slice(0,10)
              history.push('/schedule/'+current_date+'/'+false+'/'+true)
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
