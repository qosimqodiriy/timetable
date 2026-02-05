import type { TimetableModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getTimetables_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<TimetableModel>]> {
    try {
        const response = <BaseListModel<TimetableModel>> await axiosInstance.get('/timetable/v1/timetable', {
            params: {
                ...params,
                page: params.page ? params.page - 1 : 0,
            }
        })
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}



export async function createTimetable_API(payload: TimetableModel): Promise<[null, TimetableModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/timetable/v1/timetable', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function generateTimetable_API(name: string): Promise<[null, TimetableModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/timetable/v1/timetable/generate', {
            name
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}