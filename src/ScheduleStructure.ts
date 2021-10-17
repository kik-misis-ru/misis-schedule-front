export class Bell {
  lessonName: string
  teacher: string
  room: string
  startAndfinishTime: string
  lessonType: string
  lessonNumber: any
  url: string
  groupNumber: string

  constructor(
    lessonName = "",
    teacher = "",
    room = "",
    startAndfinishTime = "",
    lessonType = "",
    lessonNumber = "",
    url = "",
    groupNumber = ""
  ) {
    this.lessonName = lessonName;
    this.teacher = teacher;
    this.room = room;
    this.startAndfinishTime = startAndfinishTime;
    this.lessonType = lessonType;
    this.lessonNumber = lessonNumber;
    this.url = url;
    this.groupNumber = groupNumber;
  }

  reset() {
    this.lessonName = "";
    this.teacher = "";
    this.room = "";
    this.startAndfinishTime = "";
    this.lessonType = "";
    this.lessonNumber = "";
    this.url = "";
    this.groupNumber = "";
  }
}
