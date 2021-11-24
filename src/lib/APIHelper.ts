import axios, {AxiosResponse} from "axios";

import filial from '../data/filial.json';

<<<<<<< HEAD:src/APIHelper.ts
import {Bell} from './types/ScheduleStructure'
import {IScheduleDays,DEFAULT_STATE_WEEK_DAY, LessonStartEnd} from './App'
=======
import {Bell} from '../types/ScheduleStructure'
import {IScheduleDays,DEFAULT_STATE_DAY, LessonStartEnd} from '../App'
>>>>>>> f9c992cdbd15de4fcd0936f779742421e03d285a:src/lib/APIHelper.ts

import {IDayHeader} from '../types/base'

export interface ITeacherApiData extends ITeacherInfo {
  // first_name: string
  // mid_name: string
  // last_name: string
  status: '-1' | '-2'
  id: string
}

export const NO_LESSONS_NAME = "Пар нет 🎉"

//

interface IScheduleTeacherData {
  name: string
}

interface IScheduleGroup {
  name: string
  subgroup_name: string | undefined
}

export interface IScheduleLessonInfo {
  groups: IScheduleGroup[]
  subject_name: string
  teachers: IScheduleTeacherData[]
  room_name: string
  type: string
  other: string
}
export interface IScheduleFormatData{
  schedule: IScheduleDays
  day: IDayHeader[]
}

interface IScheduleBellHeader {
  start_lesson: string
  end_lesson: string
}

interface ISchedule {
  header: IScheduleBellHeader
  day1: IScheduleLessonInfo
  day2: IScheduleLessonInfo
  day3: IScheduleLessonInfo
  day4: IScheduleLessonInfo
  day5: IScheduleLessonInfo
  day6: IScheduleLessonInfo
  day7: IScheduleLessonInfo
}

interface IScheduleHeaderDay {
  date: string
}

interface IScheduleHeader {
  day1: IScheduleHeaderDay,
  day2: IScheduleHeaderDay,
  day3: IScheduleHeaderDay,
  day4: IScheduleHeaderDay,
  day5: IScheduleHeaderDay,
  day6: IScheduleHeaderDay,
  day7: IScheduleHeaderDay,
}

// interface Schedule {
//   bell: ScheduleHeader[]
// }

export interface IScheduleApiData {
  schedule: ISchedule[]
  schedule_header: IScheduleHeader
}

export interface ITeacherInfo{
  last_name: string,
  first_name: string,
  mid_name: string
}

export interface IScheduleByUserIdData {
  schedule: IScheduleApiData, 
  formatScheduleData: IScheduleFormatData,
  isActive: boolean, //отправка пушей
  hour: number, //час отправки пушей
  minute: number, //минута отправки пушей
  userId: string,
  filialId: string,
  groupId: string,
  groupName: string,
  subgroup_name: string,
  eng_group: string,
  teacher_id: string,
  teacher_info: ITeacherInfo
}

export interface IPushData{
  sub: string,
  hour: number,
  minute: number
}

//

//const API_URL = "http://127.0.0.1:8000/";
const API_URL = "https://misis-hub.herokuapp.com/";

export async function getScheduleFromDb(groupId: string, english_group_id: string, date: string): Promise<IScheduleFormatData> {
  const url = `${API_URL}schedule`;
  const config = {
    params: {
      group_id: groupId,
      english_group_id: english_group_id,
      date: date,
    },
  };
  console.log(`APIHelper: getScheduleFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: rawSchedule} = response;
  const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
  console.log(`APIHelper: getScheduleFromDb: parsedSchedule:`, parsedSchedule);
  let formatShcdeuleData : IScheduleFormatData = FormateSchedule(parsedSchedule, undefined)
  return formatShcdeuleData;
}

export async function getScheduleTeacherFromDb(teacherId: string, date: string): Promise<IScheduleFormatData> {
  const url = `${API_URL}schedule_teacher`;
  const config = {
    params: {
      teacher_id: teacherId,
      date: date,
    },
  };
  console.log(`APIHelper: getScheduleTeacherFromDb: url: "${url}", config:`, config);
  const response = await axios.get(url, config);

  const {data: rawSchedule} = response;
  const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
  console.log(`APIHelper: getScheduleTeacherFromDb: parsedSchedule:`, parsedSchedule);
  let formatSchedule:IScheduleFormatData = FormateSchedule(parsedSchedule, undefined);
  return formatSchedule;
}

export async function getSchedulebyUserId(user_id: string): Promise<IScheduleByUserIdData>{
  const url = `${API_URL}schedule_by_user_id`;
  const config={
    params:{
      user_id: user_id
    }
  }
  const response = await axios.get(url, config);

  const {data: rawSchedule} = response;
  const parsedSchedule: IScheduleByUserIdData = JSON.parse(rawSchedule);
  console.log(`APIHelper: schedule_by_user_id: parsedSchedule:`, parsedSchedule);
  parsedSchedule.formatScheduleData = FormateSchedule(parsedSchedule.schedule, parsedSchedule.subgroup_name )
  return parsedSchedule;
}


export async function getIdTeacherFromDb(teacher_in: string): Promise<ITeacherApiData> {
  console.log(`APIHelper: teacher_in`, teacher_in);

  const url = `${API_URL}teacher`;
  const config = {
    params: {
      teacher_initials: teacher_in,
    },
  };
  console.log(`APIHelper: getIdTeacherFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: answer} = response;
  const parsedTeacherData = JSON.parse(answer) as ITeacherApiData;
  console.log(`APIHelper: getIdTeacherFromDb: parsedTeacherData:`, parsedTeacherData);
  return parsedTeacherData;
}

export async function getInTeacherFromDb(teacher_id: string): Promise<ITeacherApiData> {
  const url = `${API_URL}teacher_initials`;
  const config = {
    params: {
      teacher_id: teacher_id,
    },
  };
  console.log(`APIHelper: getInTeacherFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: rawTeacherData} = response;
  const parsedTeacherData = JSON.parse(rawTeacherData) as ITeacherApiData;
  console.log(`APIHelper: getInTeacherFromDb: parsedTeacherData:`, parsedTeacherData);
  return parsedTeacherData;
}

export async function addUserToPushNotification( sub: string, hour: number, minute: number, isActive: boolean){
  const url = `${API_URL}add_user_to_push_notification`;
  const data = {
    "sub": sub, 
    "hour": hour, 
    "minute": minute,
    "isActive": isActive,
    // "day": day
  };
  console.log(`APIHelper: add_user_to_push_notification: url: "${url}", data:`, data);

  const response = await axios.post(url, data);
  console.log(`APIHelper: add_user_to_push_notification: response:`, response);

  return response;
}


export async function createUser(
  userId: string,
  filialId: string,
  groupId: string,
  subGroup: string,
  engGroup: string,
  teacher_id: string,
): Promise<AxiosResponse<any>> {
  const url = `${API_URL}users`;
  const data = {
    "user_id": userId,
    "filial_id": filialId,
    "group_id": groupId,
    "subgroup_name": subGroup,
    "eng_group": engGroup,
    "teacher_id": teacher_id
  };
  console.log(`APIHelper: createUser: url: "${url}", data:`, data);

  const response = await axios.post(url, data);
  console.log(`APIHelper: createUser: response:`, response);

  return response;
}


interface StarUser {
  userId: string
  filialId: string
  groupId: string
  subGroup: string
  engGroup: string
  teacherId: string
}

export async function setGroupStar(
  props: StarUser,
  value: boolean
): Promise<AxiosResponse<any>> {
  return value
    ? createUser(
      props.userId,
      filial.id,
      props.groupId,
      props.subGroup,
      props.engGroup,
      props.teacherId
    )
    : createUser(
      props.userId,
      "",
      "",
      "",
      "",
      "",
    )
}

export async function setTeacherStar(
  props: StarUser,
  value: boolean
): Promise<AxiosResponse<any>> {
  return value ?
    createUser(
      props.userId,
      filial.id,
      props.groupId,
      props.subGroup,
      props.engGroup,
      props.teacherId,
    )
    : createUser(
      props.userId,
      "",
      props.groupId,
      props.subGroup,
      "",
      "",
    );

}


interface IUserData {
  group_id,
  subgroup_name,
  eng_group,
  teacher_id,
}

export async function getUser(userId: string): Promise<IUserData | "0"> {
  const url = `${API_URL}users`;
  const config = {
    params: {
      user_id: userId,
    },
  };
  console.log(`APIHelper: getUser: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: answer} = response;
  console.log(`APIHelper: getUser: answer:`, answer);
  return answer;
}

export async function getGroupById(groupId: number) {
  const url = `${API_URL}group_by_id`;
  const config = {
    params: {
      group_id: groupId,
    },
  };
  console.log(`APIHelper: getGroupById: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: groupInfo} = response;
  console.log(`APIHelper: getGroupById: groupInfo:`, groupInfo);
  return groupInfo;
}

export async function getGroupByName(groupName: string) {
  const url = `${API_URL}group_by_name`;
  const config = {
    params: {
      name: groupName,
    },
  };
  console.log(`APIHelper: getGroupByName: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data: groupInfo} = response;
  console.log(`APIHelper: getGroupByName: groupInfo:`, groupInfo);
  return groupInfo;
}

export async function  IsEnglishGroupExist(group_num: number) : Promise<boolean>{
  const url = `${API_URL}is_english_group_exist`;
  const config = {
    params: {
      group_num: group_num,
    },
  };
  console.log(`APIHelper: isEnglishGroupExist: url: "${url}", config:`, config);

  const response = await axios.get(url, config);

  const {data} = response;
  console.log(`APIHelper: isEnglishGroupExist: response:`, data);
  let jsonData= JSON.parse(data)
  return jsonData.status === '1' ;
}

export function FormateSchedule(schedule_from_api: IScheduleApiData, subgroup) : IScheduleFormatData{
  let schedule = new Array(7).fill([]);
  let day: IDayHeader[] = DEFAULT_STATE_WEEK_DAY;
      for (let day in schedule) {
        schedule[day] = Array(7).fill([])
        for (let bell in schedule[day]) {
          schedule[day][bell] = new Bell();
        }
      }
      for (let day in schedule) {
        for (let bell in schedule[day]) {
          schedule[day][bell].lessonName = "";
          schedule[day][bell].teacher = "";
          schedule[day][bell].room = "";
          schedule[day][bell].lessonType = "";
          schedule[day][bell].lessonNumber = "";
          schedule[day][bell].url = "";
          schedule[day][bell].groupNumber = "";
        }
      }

    for (let day_num = 1; day_num < 7; day_num++) {

      // todo
      let countLessons = 0;
     
      day[day_num - 1].count = 0;

      if (schedule_from_api.schedule !== null) {
        day[day_num - 1].date = schedule_from_api.schedule_header[`day_${day_num}`].date;
        for (let bell in schedule_from_api.schedule) { //проверка
          let bell_num = Number(bell.slice(-1)) - 1
          let lesson_info: IScheduleLessonInfo = schedule_from_api.schedule[bell][`day_${day_num}`].lessons[0]
          let lesson_info_state: Bell = schedule[day_num - 1][bell_num]

          const subgroup_name = lesson_info?.groups?.[0]?.subgroup_name;

          let header = schedule_from_api.schedule[bell]['header']
          LessonStartEnd[bell_num] = {start: header['start_lesson'], end: header['end_lesson']}

          if (
            (schedule_from_api.schedule[bell_num] !== undefined) &&
            (lesson_info !== undefined) &&
            (subgroup_name !== undefined) &&
            (subgroup_name === subgroup) &&
            (subgroup !== "")
          ) {

            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = bell.slice(5, 6);
            lesson_info_state.url = lesson_info.other;
            countLessons++;
            day[day_num - 1].count++;

          } else if (
            (schedule_from_api.schedule[bell] !== undefined) &&
            (lesson_info !== undefined) &&
            (subgroup_name !== undefined) &&
            (subgroup_name !== subgroup) &&
            (subgroup !== "")
          ) {
            lesson_info_state.reset()

          } else if (
            (schedule_from_api.schedule[bell] !== undefined) &&
            (lesson_info !== undefined)
          ) {
            lesson_info_state.lessonName = lesson_info.subject_name;
            lesson_info_state.teacher = lesson_info.teachers[0].name;
            lesson_info_state.room = lesson_info.room_name;
            lesson_info_state.lessonType = lesson_info.type;
            lesson_info_state.lessonNumber = bell.slice(5, 6);
            lesson_info_state.url = lesson_info.other;

            for (let name in lesson_info.groups) {
              lesson_info_state.groupNumber += `${lesson_info.groups[name].name} `;
            }
            countLessons++;
            day[day_num - 1].count++;

          } else {
            lesson_info_state.reset();
          }
        }
        if (day[day_num - 1].count === 0)
          schedule[day_num - 1][0].lessonName = NO_LESSONS_NAME;

      } else {
        schedule[day_num - 1][0].lessonName = NO_LESSONS_NAME;
      }

    }
  
  return {schedule: schedule, day: day} as IScheduleFormatData
}
