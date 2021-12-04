import * as ApiHelper from "./ApiHelper";


import{
  IDayHeader
} from '../types/base'

import { Bell } from '../types/ScheduleStructure'
import { group } from "console";

import {MS_IN_DAY, formatDateWithDashes, getFirstDayWeek} from '../lib/datetimeUtils'
import {formatTeacherName} from '../lib/formatters'
import { threadId } from "worker_threads";
import ScheduleDay from "../components/ScheduleDay";


export interface IPushSettings {
  Hour: number
  Minute: number
  IsActive: boolean
}

export interface IDay {
  current_week: IDayHeader[]
  other_week: IDayHeader[]
}

export interface IStudentSettings{
  groupName: string,
  subGroupName: string,
  engGroupName: string
}
export interface ITeacherSettings{
  initials: string
}
export interface IStudentValidation{
  IsGroupNameError: boolean,
  IsSubGroupError: boolean,
  IsEngGroupError: boolean
}
export interface ITeacherValidation{
  IsInitialsError: boolean
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
  public unsavedUser: IUserData 
  public pushSettings: IPushSettings 
  public isStudent: boolean
  public isSchedule: boolean
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
    this.isSchedule = false
    this.validation={
      teacher:{
        isTeacherError: false
      }
    }
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
      if(userSchedule == undefined){
        this.isSavedUser = false
      }
      else{
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
     this.isSavedSchedule =isSavedSchedule
     console.log("SetWeekSchedule: IsSave:", isSavedSchedule)
     console.log("SetWeekSchedule: i:", i)
     this.isSchedule = false;
    if (isSavedSchedule) {
      let saved_schedule = this.saved_schedule
      let day = this.day
      if(scheduleData.schedule && scheduleData.day){
        if (i == 0) {
          saved_schedule.current_week = scheduleData.schedule
          day.current_week = scheduleData.day
        }
        else {
          saved_schedule.other_week = scheduleData.schedule
          day.other_week = scheduleData.day
        }
      }
     
      this.saved_schedule=saved_schedule
      
      this.day = day
    }
    else {
      let other_schedule = this.other_schedule
      let day = this.day
      if( scheduleData.schedule && scheduleData.day){
        if (i == 0 ) {
          console.log("Set other shcedule; current week")
          other_schedule.current_week = scheduleData.schedule
          day.current_week = scheduleData.day
        }
        else {
         
          day.other_week = scheduleData.day
          other_schedule.other_week = scheduleData.schedule
        }
      }
      
        this.other_schedule = other_schedule
        this.day = day

    }
    this.isSchedule = true
    
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

  public  async getScheduleFromDb(date: Date, isSave: boolean, isCurrentWeek: Boolean) {
    let teacher_id, group_id, eng;
    console.log("isSave", isSave)
    if (isSave) {
      teacher_id = this.user?.teacher_id;
      group_id = this.user?.group_id;
      console.log("getScheduleFromDb: groupId", group_id)
      if(group_id!=undefined && this.user!=undefined){
        console.log("GROUP:",this.user.group)
        //group_id = this.convertGroupNameToGroupId(this.user?.group)
      }
      else{
        return
      }
      eng = this.user?.eng_group
      if (this.isTeacher(isSave) && this.unsavedUser != undefined && this.user?.teacher != undefined) {
        this.isStudent=false;
        this.unsavedUser.teacher = this.user.teacher
      }
      else {
        this.isStudent = true;
      }
    }
    else {
      teacher_id = this.unsavedUser.teacher_id;
      group_id = this.unsavedUser.group_id;
      eng = this.unsavedUser.eng_group;
    }
    const firstDayWeek = getFirstDayWeek(date);
    console.log("apiModel:getScheduleFromDb: firstDayWeek", firstDayWeek)
    console.log("apiModel:getScheduleFromDb: Date", date)
    let week = isCurrentWeek===true ? 0 : 1
    if (this.isTeacher(isSave)) {

      await ApiHelper.getScheduleTeacherFromDb(
        teacher_id,
        firstDayWeek
      ).then((response) => {
        this.SetWeekSchedule(response, week, isSave);
      })
      this.isStudent = false
    }
    else {
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
    let teacher: ITeacherSettings = {initials: teacherName}
    return !(await (await this.CheckIsCorrectTeacher(teacher, false)).IsInitialsError);
  }

  public async convertGroupNameToGroupId(groupName: string): Promise<Number>{
    if(groupName && groupName!=""){
      return await ApiHelper.getGroupByName(groupName);
    }
    return -1
  }
     
  // todo исправить асинхронную работу
  public  async CheckIsCorrectTeacher(settings: ITeacherSettings, isSave: boolean): Promise<ITeacherValidation> {
    let result: ITeacherValidation ={
      IsInitialsError: true
    }
    if(settings.initials!=undefined){
      let teacherData = await  ApiHelper.getIdTeacherFromDb(settings.initials)
        console.log('handleTeacherChange:', teacherData);
        console.log('handleTeacherChange: status:', teacherData.status);
  
        console.log("Number(teacherData.status)", Number(teacherData.status))
        result.IsInitialsError = Number(teacherData.status)!=1
        if (
          (teacherData.status == "-1") ||
          (teacherData.status == "-2")
        ) {
          console.log("handleTeacherChange: teacherData.status:", teacherData.status);
          this.validation.teacher.isTeacherError = false
          return {IsInitialsError : false}
  
        } else
         {
          // ApiHelper.getScheduleTeacherFromDb(
          //   teacherData.id,
          //   getFirstDayWeek(new Date())
          // ).then((response) => {
          //   console.log("handleTeacherChange: getScheduleTeacherFromDb: response", response)
          //   this.SetWeekSchedule(response, 0, isSave);
          // });
         }
  
        console.log('handleTeacherChange: formatTeacherName(teacherData):', formatTeacherName(teacherData))
  
        let parsedTeacher2 = await ApiHelper.getInTeacherFromDb(teacherData.id)
          let  teacher = formatTeacherName(parsedTeacher2)
          if(isSave && this.user!=undefined){
            this.user.teacher = teacher
          }
          else if(!isSave){
            this.unsavedUser  = {
              teacher: teacher,
              teacher_id: teacherData.id,
              group_id : "",
              filial_id:"",
              eng_group: "",
              subgroup_name: "",
              group: ""
            }
            console.log("UNSAVED USER", this.unsavedUser)
          }
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
          return result
    }
    return result
  }

  public  async CheckIsCorrectStudent(settings: IStudentSettings, isSave: boolean): Promise<IStudentValidation> {
    console.log('App: isCorrect', settings)
    let IsError: IStudentValidation ={
      IsGroupNameError: true,
      IsSubGroupError: true,
      IsEngGroupError: true
    }
    let promiseGroupName = ApiHelper.getGroupByName(settings.groupName);
    let promiseEnglishGroup = ApiHelper.IsEnglishGroupExist(Number(settings.engGroupName));

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
          let updateUser ={
            group_id: groupId,
            group : group.name,
            eng_group: settings.engGroupName,
            subgroup_name: settings.subGroupName,
            teacher_id: "",
            teacher: "",
            filial_id: this.user== undefined ? "" : this.user.filial_id
          }
          if(isSave){
           ApiHelper.createUser(
            this.userId,
            this.user== undefined ? "" : this.user.filial_id,
            group.id,
            settings.subGroupName,
            settings.engGroupName,
            ""
          )
            this.user = updateUser
          }
          else{
            this.unsavedUser = updateUser
          }
          
        }
        return IsError
      })
      
    }

   public  async LoadSchedule(isSave: boolean): Promise<void> {
      let group_id = isSave ? this.user?.group_id : this.unsavedUser?.group_id
      let eng_group = isSave ?  this.user?.eng_group : this.unsavedUser?.eng_group
      if(eng_group == undefined){
        eng_group = ""
      }
      if(group_id == undefined){
        return
      }
      await ApiHelper.getScheduleFromDb(
        group_id,
        String(eng_group),
        getFirstDayWeek(new Date())
      )
        .then((response) => {
          this.isStudent = true
          this.SetWeekSchedule(response, 0, isSave);
        })
    }

    


  protected isTeacher(isSave: boolean) {
    console.log("IsTeacher", this.unsavedUser)
    return  isSave ?  this.user!=undefined && this.user.teacher_id != "" && this.user.teacher_id != undefined
    : this.unsavedUser!=undefined && this.unsavedUser.teacher_id != "" && this.unsavedUser.teacher_id != undefined
  }
  public CheckGroupOrTeacherSetted() : boolean{
    let groupApiModel = this.user?.group==undefined ? "" : this.user.group
    let teacher = this.isSavedUser ? this.user?.teacher : this.unsavedUser?.teacher
    if(teacher == undefined){
      teacher = ""
    }
    if(groupApiModel == undefined){
      groupApiModel = "";
    }
    return groupApiModel!="" || teacher!=""
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
