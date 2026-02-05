import { getClass_DEFAULT } from "../class"
import type { LessonModel } from "./model"

export function getLesson_DEFAULT(): LessonModel {
  const object: LessonModel = {
    id: null,
    classId: [],
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