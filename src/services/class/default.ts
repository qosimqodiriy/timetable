import { getTeacher_DEFAULT } from "../teacher"
import type { ClassModel } from "./model"

export function getClass_DEFAULT(): ClassModel {
  const object: ClassModel = {
    id: null,
    availabilities: [],
    createdDate: '',
    name: '',
    rooms: [],
    shortName: '',
    teacher: getTeacher_DEFAULT(),
    teacherId: null,
  }

  return object
}