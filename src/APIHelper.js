import axios from "axios";

// const API_URL = "http://127.0.0.1:8000/";
const API_URL = "https://misis-hub.herokuapp.com/";


export async function getScheduleFromDb(groupId, date) {
  const { data: answer } = await axios.get(`${API_URL}schedule`, {
    params: {
      group_id: groupId,
      date: date
    },
  })
  return answer;
}


export async function createUser(userId, filialId, groupId, subGroup, engGroup) {
  return await axios.post(`${API_URL}users`, {
    "user_id": userId,
    "filial_id": filialId,
    "group_id": groupId,
    "subgroup_name": subGroup,
    "eng_group": engGroup,
  });
}


export async function getUser(userId) {
  const { data: answer } = await axios.get(`${API_URL}users`, {
    params: {
      user_id: userId
    },
  })
  return answer;
}