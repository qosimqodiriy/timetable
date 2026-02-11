import { getTeacher_DEFAULT } from "../teacher"
import type { ClassModel, ClassGroupsModel } from "./model"

export function getClass_DEFAULT(): ClassModel {
  const object: ClassModel = {
    id: 0,
    availabilities: [],
    createdDate: '',
    name: '',
    rooms: [],
    groups: [],
    shortName: '',
    updatedDate: '',
    teacherId: null,
    teacher: getTeacher_DEFAULT(),
  }

  return object
}

export function getClassGroups_DEFAULT(): ClassGroupsModel[] {
  const object: ClassGroupsModel[] = [
    { name: "1-guruh" },
    { name: "2-guruh" },
    { name: "Qiz bolalar" },
    { name: "O'g' il bolalar"},
  ]

  return object
}