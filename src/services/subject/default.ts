import type { SubjectModel } from "./model"

export function getSubject_DEFAULT(): SubjectModel {
  const object: SubjectModel = {
    id: 0,
    name: '',
    shortName: '',
    availabilities: [],
    emoji: '',
    color: '',
    createdDate: '',
    updatedDate: '',
    weight: 0,
  }

  return object
}