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
    classId: null,
    class: getClass_DEFAULT(),
    teacherId: null,
    rooms: [],
    roomIds: [],
    subjectId: null,
    lessonCount: null,
    dayOfWeek: '',
    hour: '',
    frequency: '',
    period: null,
    createdDate: '',
    updatedDate: '',
    groupDetails: [],
    groupId: null,
  }

  return object
}