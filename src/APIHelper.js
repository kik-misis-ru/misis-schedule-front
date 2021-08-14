import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";
// const API_URL = "https://serene-inlet-82302.herokuapp.com/";

<<<<<<< HEAD

export async function getScheduleFromDb(groupId, date) {
  const { data: answer } = await axios.get(`${API_URL}schedule`, {
    params: {
      group_id: groupId,
      date: date
    },
  })
  return answer;
}


=======
>>>>>>> fb1565c8f6f87468fe896f3fed34353d68038907
export async function createUser(userId, filialId, groupId, subGroup, engGroup) {
  return await axios.post(`${API_URL}users`, {
    "user_id": userId,
    "filial_id": filialId,
    "group_id": groupId,
    "subgroup_name": subGroup,
    "eng_group": engGroup,
  });
}

<<<<<<< HEAD

export async function getUser(userId) {
  const { data: answer } = await axios.get(`${API_URL}users`, {
=======
export async function getSchedule(groupId, date) {
  const { data: answer } = await axios.get(`${API_URL}schedule`, {
    params: {
      group_id: groupId,
      date: date
    },
  })
  console.log(answer);
  return answer;
}

export async function getUser(UserId) {
  const { data: answer } = await axios.get(API_URL + "user/", {
>>>>>>> fb1565c8f6f87468fe896f3fed34353d68038907
    params: {
      user_id: userId
    },
  })
  return answer;
}
