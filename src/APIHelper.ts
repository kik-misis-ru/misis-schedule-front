import axios from "axios";

export interface ITeacherApiData {
  first_name: string
  mid_name: string
  last_name: string
  status: string
  id: string
}


//const API_URL = "http://127.0.0.1:8000/";
const API_URL = "https://misis-hub.herokuapp.com/";


export async function getScheduleFromDb(groupId: string, english_group_id: string, date: string) {
  const {data: answer} = await axios.get(`${API_URL}schedule`, {
    params: {
      group_id: groupId,
      english_group_id: english_group_id,
      date: date
    },
  })
  return answer;
}

export async function getScheduleTeacherFromDb(teacherId: string, date: string) {
  const {data: answer} = await axios.get(`${API_URL}schedule_teacher`, {
    params: {
      teacher_id: teacherId,
      date: date
    },
  })
  return answer;
}

export async function getIdTeacherFromDb(teacher_in: string): Promise<ITeacherApiData> {
  const { data: answer } = await axios.get(`${API_URL}teacher`, {
    params: {
      teacher_initials: teacher_in
    },
  })
  return answer;
}

export async function getInTeacherFromDb(teacher_id: string): Promise<ITeacherApiData> {
  const { data: rawTeacherData } = await axios.get(`${API_URL}teacher_initials`, {
    params: {
      teacher_id: teacher_id
    },
  })
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
) {
  const data = {
    "user_id": userId,
    "filial_id": filialId,
    "group_id": groupId,
    "subgroup_name": subGroup,
    "eng_group": engGroup,
    "teacher_id": teacher_id
  };
  return await axios.post(`${API_URL}users`, data);
}


interface IUserData {
  group_id,
  subgroup_name,
  eng_group,
  teacher_id,
}

export async function getUser(userId: string): Promise<IUserData | "0"> {
  const {data: answer} = await axios.get(`${API_URL}users`, {
    params: {
      user_id: userId
    },
  })
  return answer;
}
