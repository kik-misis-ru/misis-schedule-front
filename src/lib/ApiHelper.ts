import axios, {AxiosResponse} from "axios";

import filial from '../data/filial.json';

import {Bell} from '../types/ScheduleStructure'
import {LessonStartEnd} from '../App'

import {IScheduleDays, DEFAULT_STATE_WEEK_DAY} from './ApiModel'

import {IDayHeader} from '../types/base'

import {IPushSettings} from './ApiModel'

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

export interface IScheduleFormatData {
  schedule: IScheduleDays | undefined
  day: IDayHeader[] | undefined
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

export interface ITeacherInfo {
  last_name: string,
  first_name: string,
  mid_name: string
}

export interface IScheduleByUserIdData {
  day: number
  formatScheduleData: IScheduleFormatData,
  groupName: string,
  groupId: string,
  hour: number, //час отправки пушей
  isActive: boolean, //отправка пушей
  minute: number, //минута отправки пушей
  filialId: string,
  eng_group: string,
  schedule: IScheduleApiData,
  status: number,
  subgroup_name: string,
  teacher_id: string,
  teacher_info: ITeacherInfo
  userId: string,
}

export interface IPushData {
  sub: string,
  hour: number,
  minute: number
}

//

//const API_URL = "http://127.0.0.1:8000/";
const API_URL = "https://mir-misis.ru/";

export async function getScheduleFromDb(groupId: string, english_group_id: string, date: string): Promise<IScheduleFormatData> {
  const url = `${API_URL}schedule`;
  const config = {
    params: {
      group_id: groupId,
      english_group_id: english_group_id,
      date: date,
    },
  };
  console.log(`ApiHelper: getScheduleFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });

  if (response && response["status"] == 200) {
    const {data: rawSchedule} = response;
    const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
    console.log(`ApiHelper: getScheduleFromDb: parsedSchedule:`, parsedSchedule);
    let formatShcdeuleData: IScheduleFormatData = FormateSchedule(parsedSchedule, "")
    return formatShcdeuleData;
  } else {
    return {schedule: undefined, day: undefined}
  }
}

export async function getScheduleTeacherFromDb(teacherId: string, date: string): Promise<IScheduleFormatData> {
  const url = `${API_URL}schedule_teacher`;
  const config = {
    params: {
      teacher_id: teacherId,
      date: date,
    },
  };
  console.log(`ApiHelper: getScheduleTeacherFromDb: url: "${url}", config:`, config);
  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });

  if (response && response["status"] == 200) {
    const {data: rawSchedule} = response;
    const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
    console.log(`ApiHelper: getScheduleTeacherFromDb: parsedSchedule:`, parsedSchedule);
    let formatSchedule: IScheduleFormatData = FormateSchedule(parsedSchedule, "");
    return formatSchedule;
  } else {
    return {schedule: undefined, day: undefined}
  }
}


 

export async function getSchedulebyUserId(user_id: string): Promise<IScheduleByUserIdData | undefined>{
  const url = `${API_URL}data_by_user_id`;
  const config={
    params:{
      user_id: user_id
    }
  }
  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  ;


  if (response && response["status"] == 200) {
    const {data: rawSchedule} = response;
    const parsedSchedule: IScheduleByUserIdData = JSON.parse(rawSchedule);
    console.log(`ApiHelper: getSchedulebyUserId: parsedSchedule:`, parsedSchedule);
    parsedSchedule.formatScheduleData = FormateSchedule(parsedSchedule.schedule, parsedSchedule.subgroup_name)
    return parsedSchedule;
  }
}


export async function getIdTeacherFromDb(teacher_in: string): Promise<ITeacherApiData | undefined> {
  console.log(`ApiHelper: teacher_in`, teacher_in);

  const url = `${API_URL}teacher_by_initials`;
  const config = {
    params: {
      teacher_initials: teacher_in,
    },
  };
  console.log(`ApiHelper: getIdTeacherFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  if (response && response["status"] == 200) {
    const {data: answer} = response;
    const parsedTeacherData = JSON.parse(answer) as ITeacherApiData;
    console.log(`ApiHelper: getIdTeacherFromDb: parsedTeacherData:`, parsedTeacherData);
    return parsedTeacherData;
  }
}

export async function getInTeacherFromDb(teacher_id: string): Promise<ITeacherApiData | undefined> {
  const url = `${API_URL}teacher_by_id`;
  const config = {
    params: {
      teacher_id: teacher_id,
    },
  };
  console.log(`ApiHelper: getInTeacherFromDb: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  if (response && response["status"] == 200) {
    const {data: rawTeacherData} = response;
    const parsedTeacherData = JSON.parse(rawTeacherData) as ITeacherApiData;
    console.log(`ApiHelper: getInTeacherFromDb: parsedTeacherData:`, parsedTeacherData);
    return parsedTeacherData;
  }
}

export async function addUserToPushNotification(sub: string, pushSettings: IPushSettings) {
  const url = `${API_URL}add_user_to_push_notification`;
  const data = {
    "sub": sub,
    "hour": pushSettings.Hour,
    "minute": pushSettings.Minute,
    "isActive": pushSettings.IsActive,
    // "day": day
  };
  console.log(`ApiHelper: add_user_to_push_notification: url: "${url}", data:`, data);

  const response = await axios.post(url, data);
  console.log(`ApiHelper: add_user_to_push_notification: response:`, response);

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
  const url = `${API_URL}user`;
  const data = {
    "user_id": userId,
    "filial_id": filialId != undefined ? filialId : "",
    "group_id": groupId != undefined ? groupId : "",
    "subgroup_name": subGroup != undefined ? subGroup : "",
    "eng_group": engGroup != undefined ? engGroup : "",
    "teacher_id": teacher_id != undefined ? teacher_id : ""
  };
  console.log(`ApiHelper: createUser: url: "${url}", data:`, data);

  const response = await axios.post(url, data);
  console.log(`ApiHelper: createUser: response:`, response);

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


export interface IUserData {
  eng_group: string
  filial_id: string
  group_id: string
  subgroup_name: string
  teacher_id: string
  user_id: string
}

export type GetUserResult = IUserData | "0"

export async function getUser(userId: string): Promise<GetUserResult | undefined> {
  const url = `${API_URL}users`;
  const config = {
    params: {
      user_id: userId,
    },
  };
  console.log(`ApiHelper: getUser: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  ;
  if (response && response["status"] == 200) {
    const {data: answer} = response;
    console.log(`ApiHelper: getUser: answer:`, answer);
    return answer;
  }
}

export async function getGroupById(groupId: number) {
  const url = `${API_URL}group_by_id`;
  const config = {
    params: {
      group_id: groupId,
    },
  };
  console.log(`ApiHelper: getGroupById: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  ;
  if (response && response["status"] == 200) {
    const {data: groupInfo} = response;
    console.log(`ApiHelper: getGroupById: groupInfo:`, groupInfo);
    return groupInfo;
  }
}

export async function getGroupByName(groupName: string) {
  const url = `${API_URL}group_by_name`;
  const config = {
    params: {
      name: groupName,
    },
  };
  console.log(`ApiHelper: getGroupByName: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  ;
  if (response && response["status"] == 200) {
    const {data: groupInfo} = response;
    console.log(`ApiHelper: getGroupByName: groupInfo:`, groupInfo);
    return groupInfo;
  }


}


export async function IsEnglishGroupExist(group_num: number): Promise<boolean> {
  const url = `${API_URL}is_english_group_exist`;
  const config = {
    params: {
      group_num: group_num,
    },
  };
  console.log(`ApiHelper: isEnglishGroupExist: url: "${url}", config:`, config);

  const response = await axios.get(url, config).catch((error) => {
    console.log(error);
  });
  ;
  if (response && response["status"] == 200) {
    const {data} = response;
    console.log(`ApiHelper: isEnglishGroupExist: response:`, data);
    let jsonData = JSON.parse(data)
    return jsonData.status === '1';
  }
  return false
}

export function FormateSchedule(schedule_from_api: IScheduleApiData, subgroup): IScheduleFormatData {
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
          (subgroup_name !== "") &&
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
          (subgroup_name !== "") &&
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
