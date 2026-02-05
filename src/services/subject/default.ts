import type { SubjectModel } from "./model"

export function getSubject_DEFAULT(): SubjectModel {
  const object: SubjectModel = {
    id: null,
    name: '',
    shortName: '',
    availabilities: [],
    emoji: '',
    color: '',
    weight: 0,
  }

  return object
}