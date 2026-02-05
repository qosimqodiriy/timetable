import type { TemplateModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getTemplates_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<TemplateModel>]> {
    try {
        const response = <BaseListModel<TemplateModel>> await axiosInstance.get('/templates/v1', {
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



export async function getTemplatesAll_API(): Promise<[BaseError, null] | [null, TemplateModel[]]> {
    try {
        const response = <TemplateModel[]> await axiosInstance.get('/templates/v1/all')
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createTemplate_API(payload: TemplateModel): Promise<[null, TemplateModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.post('/templates/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateTemplate_API(payload: TemplateModel): Promise<[null, TemplateModel] | [BaseError, null]> {
    try {
        const response = <any> await axiosInstance.put('/templates/v1', {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}