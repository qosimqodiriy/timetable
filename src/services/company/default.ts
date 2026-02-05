import { type CompanyModel, type PeriodModel } from './model'

export function getCompany_DEFAULT(): CompanyModel {
  const object: CompanyModel = {
    id: null,
    name: '',
    description: '',
    daysOfWeek: [],
    periods: [],
    createdDate: '',
    lastModifiedDate: '',
  }

  return object
}


export function getPeriod_DEFAULT(): PeriodModel {
  const object: PeriodModel = {
    name: '',
    startTime: '',
    endTime: '',
    duration: null,
    isBreak: null,
  }

  return object
}