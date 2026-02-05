import type { TimetableModel } from "./model"

export function getTimetable_DEFAULT(): TimetableModel {
  const object: TimetableModel = {
    id: null,
    taskId: null,
    name: '',
    scheduled: null,
    unscheduled: null,
    score: null,
    teacherGaps: null,
    classGaps: null,
    deleted: false,
    createdDate: '',
  }

  return object
}