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

import DayOfWeek from '../language-ru/DayOfWeek';


const FIRST_DAY_OTHER_WEEK = 8;

const DAY_IN_SECONDS = 86400


export interface ScheduleViewProps {
  apiModel: ApiModel
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
  timeParam: number
  page: number
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
}

export class ScheduleView extends React.Component<ScheduleViewProps, ScheduleViewState> {


  componentDidMount() {
    this.props.assistant.on('for_this_week', () => {
      this.CurrentWeek()
    })
    this.props.assistant.on('for_next_week', () => {
      this.NextWeek()
    })

    this.props.assistant.on('day_schedule', (action) => {
      console.log("ACTION",action)
      const {dayOfWeek: strDayOfWeekNum_} = action.note[0];
      this.handleDayChange(parseInt(strDayOfWeekNum_),action.note[1], action.note[2])

    })

    
  }




  constructor(props) {
    super(props);

    const getIsCorrectTeacher = () => {
      return this.props.getIsCorrectTeacher()
    }

    let apiModel =this.props.apiModel;
    console.log("this.props.IsSavedSchedule", this.props.IsSavedSchedule);
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
      schedule: schedule
    }
   
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

  handleDayChange(dayOfWeek: number, note1, note2){
     if (this.props.apiModel.CheckGroupOrTeacherSetted()) {
      const dayOfWeekZeroIndex = dayOfWeek - 1;
      if (note1 === null && note2 === null) {
        history.push('/schedule/'+this.props.Date.toISOString().slice(0,10)+'/'+this.props.IsSavedSchedule+'/'+this.props.IsCurrentWeek+'/'+Number(dayOfWeek-2))
      } else {
        
        if (note1 !== null) {
          console.log('dispatchAssistantAction: day_schedule: note[1]:', note1);
          history.push('/schedule/'+this.props.Date.toISOString().slice(0,10)+'/'+this.props.IsSavedSchedule+'/'+this.props.IsCurrentWeek+'/'+Number(dayOfWeek-2))

        } else if (note2 !== null) {
          let date = this.props.Date
          date.setDate(date.getDate()+7)
          history.push('/schedule/'+date.toISOString().slice(0,10)+'/'+this.props.IsSavedSchedule+'/'+false+'/'+Number(dayOfWeek-1))

        }
     }

      const dayOfWeekLongPrepositional = DayOfWeek.long.prepositional[dayOfWeekZeroIndex]?.toLowerCase();

      this.props.assistant.sendSay6(dayOfWeekLongPrepositional);


    }
  }

  render() {
    const {schedule } = this.props;
    let isReady = this.props.apiModel.isSchedule
    let teacherName =this.props.IsSavedSchedule? this.props.apiModel.user?.teacher : this.props.apiModel.unsavedUser?.teacher
    let teacher = teacherName == undefined ? "" : teacherName
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
            selectedIndex={this.props.page}
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
              history.push('/schedule/'+this.props.Date.toISOString().slice(0,10)+'/'+this.props.IsSavedSchedule+'/'+this.props.IsCurrentWeek+'/'+weekDayIndex)
            }}
          />

          <ScheduleDay
            isReady={isReady}
            dayLessons={
              String(this.props.IsCurrentWeek)=="true"
                ? schedule.current_week[this.props.page]
                : schedule.other_week[this.props.page]
            }
            currentLessonNumber={this.state.current}
            isTeacherAndValid={!this.props.apiModel.isStudent}
            isToday={this.props.today === this.props.page && this.props.IsCurrentWeek}
            isDayOff={this.props.page == 7}
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
