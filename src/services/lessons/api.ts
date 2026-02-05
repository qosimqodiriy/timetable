import type { LessonModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getLessons_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<LessonModel>]> {
    try {
        const response = <BaseListModel<LessonModel>> await axiosInstance.get('/lessons/v1', {
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

export async function getLessonsAll_API(): Promise<[BaseError, null] | [null, LessonModel[]]> {
    try {
        const response = <LessonModel[]> await axiosInstance.get('/lessons/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createLesson_API(payload: LessonModel): Promise<[null, LessonModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/lessons/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateLesson_API(payload: LessonModel): Promise<[null, LessonModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put('/lessons/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}