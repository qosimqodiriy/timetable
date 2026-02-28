import { type AvailabilityModel, type TeacherModel, type TeacherSubjectModel } from './model'

export function getTeacher_DEFAULT(): TeacherModel {
  const object: TeacherModel = {
    id: 0,
    fullName: '',
    shortName: '',
    subjects: [],
    availabilities: [],
    createdDate: '',
    updatedDate: '',
    lastModifiedDate: '',
  }

  return object
}


export function getAvailability_DEFAULT(): AvailabilityModel {
  const object: AvailabilityModel = {
    dayOfWeek: [],
    lessons: [],
  }

  return object
}

export function getTeacherSubject_DEFAULT(): TeacherSubjectModel {
  const object: TeacherSubjectModel = {
    id: null,
    shortName: '',
    name: '',
    availabilities: [],
    emoji: '',
    color: '',
    weight: 0,
  }

  return object
}