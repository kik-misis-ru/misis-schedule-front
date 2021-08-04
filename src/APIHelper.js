import axios from "axios";

const API_URL = "http://127.0.0.1:8000/";
// const API_URL = "https://serene-inlet-82302.herokuapp.com/";


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

export async function updateUser(UserId,
  name,
  foodLevel,
  playLevel,
  sleepLevel,
  timeOfExit,
  sec,
  min,
  hour,
  kusua,
  flag) {
    const body = {
      UserId,
      name,
  foodLevel,
  playLevel,
  sleepLevel,
  timeOfExit,
  sec,
  min,
  hour,
  kusua,
  flag
    };
    console.log('body:', body);
  await axios.put(API_URL + "user/", {
    UserId: UserId,
    name: name,
    foodLevel: foodLevel,
    playLevel: playLevel,
    sleepLevel: sleepLevel,
    timeOfExit: timeOfExit,
    sec: sec,
    min: min,
    hour: hour,
    kusua: kusua,
    flag: flag,
  });
}