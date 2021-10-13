import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";
//const API_URL = "https://misis-hub.herokuapp.com/";


export async function getScheduleFromDb(groupId: string, english_group_id: string, date: string) {
  const { data: answer } = await axios.get(`${API_URL}schedule`, {
    params: {
      group_id: groupId,
      english_group_id: english_group_id,
      date: date
    },
  })
  return answer;
}

export async function getScheduleTeacherFromDb(teacherId: string, date: string) {
  const { data: answer } = await axios.get(`${API_URL}schedule_teacher`, {
    params: {
      teacher_id: teacherId,
      date: date
    },
  })
  return answer;
}

export async function getIdTeacherFromDb(teacher_in: string) {
  const { data: answer } = await axios.get(`${API_URL}teacher`, {
    params: {
      teacher_initials:teacher_in
    },
  })
  return answer;
}

export async function getInTeacherFromDb(teacher_id: string) {
  const { data: answer } = await axios.get(`${API_URL}teacher_initials`, {
    params: {
      teacher_id:teacher_id
    },
  })
  return answer;
}


export async function createUser(userId: string, filialId: string, groupId: string, subGroup: string, engGroup: string, teacher_id: string) {
  return await axios.post(`${API_URL}users`, {
    "user_id": userId,
    "filial_id": filialId,
    "group_id": groupId,
    "subgroup_name": subGroup,
    "eng_group": engGroup,
    "teacher_id": teacher_id
  });
}


export async function getUser(userId: string) {
  const { data: answer } = await axios.get(`${API_URL}users`, {
    params: {
      user_id: userId
    },
  })
  return answer;
}
