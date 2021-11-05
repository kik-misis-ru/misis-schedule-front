export const lesson = {
  lessonName: 'Название предмета',
  groupNumber: 'БПМ-19-2',
  teacher: 'Фамилия И.О.',
  url: 'http://ya.ru',
  room: 'Б-900',
  lessonNumber: '1',
  lessonType: 'Лекционные',
};

export const getDayLessons = (n) => new Array(n).fill(lesson).map(
  (a,i) => ({ ...a, lessonNumber: ''+ (i+1) })
);

export const dayLessons = getDayLessons(5);

