import { _companyStore } from '@/stores/base'
import type { BuildingModel } from './model'
import { axiosInstance,type BaseError, type BaseListModel, type BaseParamsModel } from '@/services/network'


export async function getBuildings_API(params: BaseParamsModel): Promise<[BaseError, null] | [null, BaseListModel<BuildingModel>]> {
    try {
        const companyId = _companyStore.value.id;
        const response = <BaseListModel<BuildingModel>> await axiosInstance.get(`/organizations/${companyId}/buildings`, {
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

export async function getBuildingsAll_API(): Promise<[BaseError, null] | [null, BuildingModel[]]> {
    try {
        const companyId = _companyStore.value.id;
        const response = <BuildingModel[]> await axiosInstance.get(`/organizations/${companyId}/buildings/all`)
        
        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}


export async function createBuilding_API(payload: BuildingModel): Promise<[null, BuildingModel] | [BaseError, null]> {
    try {
        const companyId = _companyStore.value.id;
        const response = <any> await axiosInstance.post(`/organizations/${companyId}/buildings`, {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}

export async function updateBuilding_API(payload: BuildingModel): Promise<[null, BuildingModel] | [BaseError, null]> {
    try {
        const companyId = _companyStore.value.id;
        const response = <any> await axiosInstance.put(`/organizations/${companyId}/buildings`, {
            ...payload
        })

        return [null, response]
    } catch (error) {
        return [error as BaseError, null]
    }
}