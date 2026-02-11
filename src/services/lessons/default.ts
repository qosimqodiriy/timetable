import { getClass_DEFAULT } from "../class"
import type { LessonAllModel, LessonModel } from "./model"

export function getLessonAll_DEFAULT(): LessonAllModel {
  const object: LessonAllModel = {
    classes: [],
    lessons: [],
    rooms: [],
    subjects: [],
    teachers: [],
  }

  return object
}

export function getLesson_DEFAULT(): LessonModel {
  const object: LessonModel = {
    id: null,
    classId: 0,
    class: getClass_DEFAULT(),
    teacherId: 0,
    rooms: [],
    roomIds: [],
    subjectId: 0,
    lessonCount: 0,
    dayOfWeek: '',
    hour: 0,
    frequency: '',
    period: 0,
  }

  return object
}