import axios, {AxiosResponse} from "axios";

import filial from './data/filial.json';

export interface ITeacherApiData {
  first_name: string
  mid_name: string
  last_name: string
  status: '-1' | '-2'
  id: string
}

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

//

//const API_URL = "http://127.0.0.1:8000/";
const API_URL = "https://misis-hub.herokuapp.com/";


export async function getScheduleFromDb(groupId: string, english_group_id: string, date: string): Promise<IScheduleApiData> {
  const url = `${API_URL}schedule`;
  const config = {
    params: {
      group_id: groupId,
      english_group_id: english_group_id,
      date: date,
    },
  };

  const response = await axios.get(url, config);

  const {data: rawSchedule} = response;
  const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
  return parsedSchedule;
}

export async function getScheduleTeacherFromDb(teacherId: string, date: string): Promise<IScheduleApiData> {
  const url = `${API_URL}schedule_teacher`;
  const config = {
    params: {
      teacher_id: teacherId,
      date: date,
    },
  };

  const response = await axios.get(url, config);

  const {data: rawSchedule} = response;
  const parsedSchedule: IScheduleApiData = JSON.parse(rawSchedule);
  return parsedSchedule;
}

export async function getIdTeacherFromDb(teacher_in: string): Promise<ITeacherApiData> {
  const url = `${API_URL}teacher`;
  const config = {
    params: {
      teacher_initials: teacher_in,
    },
  };

  const response = await axios.get(url, config);

  const {data: answer} = response;
  return answer;
}

export async function getInTeacherFromDb(teacher_id: string): Promise<ITeacherApiData> {
  const url = `${API_URL}teacher_initials`;
  const config = {
    params: {
      teacher_id: teacher_id,
    },
  };

  const response = await axios.get(url, config);

  const {data: rawTeacherData} = response;
  const parsedTeacherData = JSON.parse(rawTeacherData) as ITeacherApiData;
  return parsedTeacherData;
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

  const response = await axios.post(url, data);

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

  const response = await axios.get(url, config);

  const {data: answer} = response;
  return answer;
}
