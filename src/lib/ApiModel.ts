import * as ApiHelper from "./ApiHelper";


import{
  IDayHeader
} from '../types/base'

import { Bell } from '../types/ScheduleStructure'
import { group } from "console";

import {MS_IN_DAY, formatDateWithDashes, getFirstDayWeek} from '../lib/datetimeUtils'
import {formatTeacherName} from '../lib/formatters'
import { threadId } from "worker_threads";


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
  eng_group: string
  filial_id: string
  group_id: string  
  subgroup_name: string 
  teacher_id: string 
  teacher:  string 
  group: string 
}


export const DEFAULT_STATE_DAY = {
  current_week: DEFAULT_STATE_WEEK_DAY,
  other_week: DEFAULT_STATE_WEEK_DAY
}

export type ThisOtherWeekBells = Bell
export type DayBells = ThisOtherWeekBells[]
export type IScheduleDays = DayBells[]


export class ApiModel {
  public userId: string 
  public user: IUserData | undefined
  public unsavedUser: IUserData |undefined
  public pushSettings: IPushSettings 
  public isStudent: boolean
  //false когда пользователь первый раз зашел в приложение
  public isSavedUser: boolean

  public validation:{
    teacher:{
      isTeacherError: boolean
    }
  }

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
    this.userId = ""
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

    this.validation={
      teacher:{
        isTeacherError: false
      }
    }
  }
 

  public async AddPush(){
    if(this.pushSettings != undefined && this.userId != undefined){
      await ApiHelper.addUserToPushNotification(this.userId, this.pushSettings)
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
      // Такой пользователь уже есть в базе
      this.isSavedUser = true

      // Получаем настройки для данного пользователя
      userSchedule = await ApiHelper.getSchedulebyUserId(this.userId)
      console.log("USER_SCHEDULE", userSchedule)

      if (userSchedule.teacher_id != "" && userSchedule.teacher_id != undefined) {
        const teacher = formatTeacherName(userSchedule.teacher_info);
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
        this.user = {
          teacher: "",
          teacher_id: "",
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
      await this.SetWeekSchedule(userSchedule.formatScheduleData, 0, true)
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

  public  async getScheduleFromDb(date: number, isSave: boolean, isCurrentWeek: boolean) {
    let teacher_id, group_id, eng;
    if (isSave) {
      teacher_id = this.user?.teacher_id;
      group_id = this.user?.group_id;
      eng = this.user?.eng_group
      if (this.isSavedTeacher() && this.unsavedUser != undefined && this.user?.teacher != undefined) {
        this.isStudent=false;
        this.unsavedUser.teacher = this.user.teacher
      }
      else {
        this.isStudent = true;
      }
    }
    else {
      teacher_id = this.unsavedUser?.teacher_id;
      group_id = this.unsavedUser?.group_id;
      eng = this.unsavedUser?.eng_group;
    }
    const firstDayWeek = getFirstDayWeek(new Date(date));
    let week = isCurrentWeek ? 0 : 1
    if (this.isSavedTeacher()) {
      await ApiHelper.getScheduleTeacherFromDb(
        teacher_id,
        firstDayWeek
      ).then((response) => {
        this.SetWeekSchedule(response, week, isSave);
      })
      this.isStudent = false
    } else {
      console.log("group_id", group_id)
      await ApiHelper.getScheduleFromDb(
        group_id,
        eng !=undefined ? eng : "",
        firstDayWeek
      ).then((response) => {
        this.SetWeekSchedule(response, week, isSave);
      })
      this.isStudent = true
    }
  }

  public async doSetTeacher(teacherName: string): Promise<boolean> {
    console.log("DoSetTeacher", this.unsavedUser)
    
    if(this.unsavedUser!=undefined){
      this.unsavedUser.teacher = teacherName
    }
    else{
      this.unsavedUser  = {
        teacher: "",
        teacher_id: "",
        group_id : "",
        filial_id:"",
        eng_group: "",
        subgroup_name: "",
        group: ""
      }
    }
    return await this.handleTeacherChange(false);
  }
     
  // todo исправить асинхронную работу
  public  async handleTeacherChange(isSave: boolean): Promise<boolean> {
    let result = 1;
    let teacher_ininials = isSave ? this.user?.teacher : this.unsavedUser?.teacher
    if(teacher_ininials!=undefined){
      await ApiHelper.getIdTeacherFromDb(teacher_ininials).then((teacherData) => {
        console.log('handleTeacherChange:', teacherData);
        console.log('handleTeacherChange: status:', teacherData.status);
  
        result = Number(teacherData.status)
        if (
          (teacherData.status == "-1") ||
          (teacherData.status == "-2")
        ) {
          console.log("handleTeacherChange: teacherData.status:", teacherData.status);
          this.validation.teacher.isTeacherError = false
          return true
  
        } else
          ApiHelper.getScheduleTeacherFromDb(
            teacherData.id,
            getFirstDayWeek(new Date())
          ).then((response) => {
            console.log("handleTeacherChange: getScheduleTeacherFromDb: response", response)
            this.SetWeekSchedule(response, 0, isSave);
          });
  
        console.log('handleTeacherChange: formatTeacherName(teacherData):', formatTeacherName(teacherData))
  
        ApiHelper.getInTeacherFromDb(teacherData.id).then((parsedTeacher2) => {
          let  teacher = formatTeacherName(teacherData)
          if(isSave && this.user!=undefined){
            this.user.teacher = teacher
          }
          else if(this.unsavedUser!=undefined){
            this.unsavedUser.teacher = teacher
          }

        })
        this.validation.teacher.isTeacherError = false
        this.isStudent = false
        if(isSave && this.user != undefined){
          this.user.teacher_id = teacherData.id
          ApiHelper.createUser(
            this.userId,
            this.user.filial_id,
            this.user.group_id,
            this.user.subgroup_name,
            this.user.eng_group,
            this.user.teacher_id,
          );
        }
        //todo: убрать проверку userId!=гтвуашткв
        else if(this.unsavedUser!=undefined){
          this.unsavedUser.teacher_id = teacherData.id
        }
        return true
      })
    }
    return false
  }


  protected isSavedTeacher() {
    return this.user!=undefined && this.user.teacher_id != "" && this.user.teacher_id != undefined
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