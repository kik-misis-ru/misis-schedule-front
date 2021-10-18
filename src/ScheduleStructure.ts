export class Bell {
  lessonName: string
  teacher: string
  room: string
  startAndFinishTime: string
  lessonType: string
  lessonNumber: string
  url: string
  groupNumber: string

  constructor(
    lessonName = "",
    teacher = "",
    room = "",
    startAndFinishTime = "",
    lessonType = "",
    lessonNumber = "",
    url = "",
    groupNumber = ""
  ) {
    this.lessonName = lessonName;
    this.teacher = teacher;
    this.room = room;
    this.startAndFinishTime = startAndFinishTime;
    this.lessonType = lessonType;
    this.lessonNumber = lessonNumber;
    this.url = url;
    this.groupNumber = groupNumber;
  }

  reset() {
    this.lessonName = "";
    this.teacher = "";
    this.room = "";
    this.startAndFinishTime = "";
    this.lessonType = "";
    this.lessonNumber = "";
    this.url = "";
    this.groupNumber = "";
  }
}
