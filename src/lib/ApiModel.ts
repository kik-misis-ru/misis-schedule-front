import * as ApiHelper from "./ApiHelper";


import{
  IDayHeader
} from '../types/base'

import { Bell } from '../types/ScheduleStructure'
import { group } from "console";





export interface IPushSettings {
  Hour: number
  Minute: number
  IsActive: boolean
}

export interface IDay {
  current_week: IDayHeader[]
  other_week: IDayHeader[]
}

export const DEFAULT_STATE_WEEK_DAY = [
  {
    title: 'Пн',
    date: "",
    count: 0
  }, {
    title: 'Вт',
    date: "",
    count: 0,
  }, {
    title: 'Ср',
    date: "",
    count: 0
  }, {
    title: 'Чт',
    date: "",
    count: 0
  }, {
    title: 'Пт',
    date: "",
    count: 0
  }, {
    title: 'Сб',
    date: "",
    count: 0
  }
]

export interface IUserData {
  eng_group: string | undefined
  filial_id: string | undefined
  group_id: string | undefined
  subgroup_name: string | undefined
  teacher_id: string | undefined
  teacher:  string | undefined
  group: string | undefined
}


export const DEFAULT_STATE_DAY = {
  current_week: DEFAULT_STATE_WEEK_DAY,
  other_week: DEFAULT_STATE_WEEK_DAY
}

export type ThisOtherWeekBells = Bell
export type DayBells = ThisOtherWeekBells[]
export type IScheduleDays = DayBells[]


export class ApiModel {
  public userId: string | undefined
  public user: IUserData | undefined
  public pushSettings: IPushSettings 
  public isStudent: boolean
  //false когда пользователь первый раз зашел в приложение
  public isSavedUser: boolean

  public day:{
    current_week: IDayHeader[]
    other_week: IDayHeader[]
  }
  //Расписание для сохраненных данных
  public saved_schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  //Расписание для несохраненных данных
  public other_schedule: {
    current_week: IScheduleDays
    other_week: IScheduleDays
  }
  public isSavedSchedule: boolean

  constructor() {
    this.pushSettings ={
      Hour: -1,
      Minute: -1,
      IsActive: false
    }
    this.day = DEFAULT_STATE_DAY
    this.saved_schedule = {
      current_week: [],
      other_week: []
    }
    this.other_schedule={
      current_week: [],
      other_week: []
    }
    this.isSavedSchedule = true
    this.isStudent = true
    this.isSavedUser = false
  }

  public async AddPush(){
    if(this.pushSettings != undefined && this.userId != undefined){
      ApiHelper.addUserToPushNotification(this.userId, this.pushSettings)
    }
  }

  // public async fetchUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  public async fetchUser(userId: string): Promise<void> {
    if (this.userId === userId && this.user) return;

    // try {
    //const apiResult = await ApiHelper.getUser(userId);
    //this.user = apiResult === '0' ? undefined : apiResult
    this.userId = userId; // устанавливаем только если данные были получены без ошибки
    // return this.user;
    // } 
  }
  public async getSchedulebyUserId(){
    let userSchedule : ApiHelper.IScheduleByUserIdData | undefined;
    if(this.userId!=undefined){
      this.isSavedUser = true
      userSchedule = await ApiHelper.getSchedulebyUserId(this.userId)
      console.log("USER_SCHEDULE", userSchedule)

      if (userSchedule.teacher_id != "" && userSchedule.teacher_id != undefined) {
        const teacher = this.formatTeacherName(userSchedule.teacher_info);
        this.user = {
          teacher: teacher,
          teacher_id: userSchedule.teacher_id,
          group_id : userSchedule.groupId,
          filial_id: userSchedule.filialId,
          eng_group: userSchedule.eng_group,
          subgroup_name: userSchedule.subgroup_name,
          group: userSchedule.groupName
        }
        this.isStudent = false

      } else if
       (userSchedule.groupName != "") {
         console.log("SET STDENT")
        this.user = {
          teacher: undefined,
          teacher_id: undefined,
          group_id : userSchedule.groupId,
          group: userSchedule.groupName,
          filial_id: userSchedule.filialId,
          eng_group: userSchedule.eng_group,
          subgroup_name: userSchedule.subgroup_name
        }
        this.isStudent = true;

      } 
    }
    if(userSchedule != undefined){
      this.SetWeekSchedule(userSchedule.formatScheduleData, 0, true)
    }

  }

  public  IsReadyShowSchedule(){
    return this.user != undefined && ((this.user.teacher_id != "" &&  this.user.teacher_id != undefined) 
    ||  (this.user.group_id != "" && this.user.group_id != undefined))
  }

  /**
   * заполнение данными расписания из бд
   */
   public async SetWeekSchedule(scheduleData: ApiHelper.IScheduleFormatData, i: Number, isSavedSchedule: boolean) {
    if (isSavedSchedule) {
      let saved_schedule = this.saved_schedule
      let day = this.day
      if (i == 0) {
        saved_schedule.current_week = scheduleData.schedule
        day.current_week = scheduleData.day
      }
      else {
        saved_schedule.other_week = scheduleData.schedule
        day.other_week = scheduleData.day
      }
      this.saved_schedule=saved_schedule
      this.isSavedSchedule =isSavedSchedule
      this.day = day
    }
    else {
      let other_schedule = this.other_schedule
      let day = this.day
      if (i == 0) {
        console.log("Set other shcedule; current week")
        other_schedule.current_week = scheduleData.schedule
        day.current_week = scheduleData.day
      }
      else {
        console.log("Set other shcedule; other week")
        day.other_week = scheduleData.day
      }
        this.other_schedule = other_schedule
        this.isSavedSchedule = isSavedSchedule
        this.day = day

    }

    
  }

  public formatTeacherName = (teacherData: ApiHelper.ITeacherInfo) => (
    `${teacherData.last_name} ${teacherData.first_name}. ${teacherData.mid_name}.`
  )

  public async createUser(){
    if(this.userId != undefined && this.user!=undefined){
      await ApiHelper.createUser(
        this.userId,
        this.user.filial_id !=undefined ? this.user.filial_id : "",
        this.user.group_id !=undefined ? this.user.group_id : "",
        this.user.subgroup_name !=undefined ? this.user.subgroup_name : "",
        this.user.eng_group !=undefined ? this.user.eng_group : "",
        this.user.teacher_id !=undefined ? this.user.teacher_id : "",
      )
    }
  }
  

  // protected async _dbGetUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  //   const apiResult = await ApiHelper.getUser(userId)
  //   this.user = apiResult === '0' ? undefined : apiResult
  //   return this.user;
  // }
  //
  // protected _localGetUser(/*userId: string*/): ApiHelper.IUserData | undefined {
  //   // предполагаем, что userId не изменяется во время работы приложения
  //   return this.user;
  // }
  //
  // protected async _lazyGetUser(userId: string): Promise<ApiHelper.IUserData | undefined> {
  //   let result = this._localGetUser(/*userId*/);
  //   if (!result) {
  //     result = await this._dbGetUser(userId)
  //   }
  //   return result;
  // }
  //
  // protected _transformUser(user: ApiHelper.IUserData | undefined): IUserModel | undefined {
  //   return user
  //     ? {
  //       engGroup: user.eng_group,
  //       filialId: user.filial_id,
  //       groupId: user.group_id,
  //       subGroup: user.subgroup_name,
  //       teacherId: user.teacher_id,
  //       userId: user.teacher_id,
  //     }
  //     : undefined;
  // }
  //
  // public async getUser(userId: string): Promise<IUserModel | undefined> {
  //   return this._transformUser(await this._lazyGetUser(userId));
  // }

}


export default ApiModel
