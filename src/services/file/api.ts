import { axiosFileInstance, type BaseError } from '@/services/network'

export async function uploadFile_API(file: any): Promise<[BaseError, null] | [null, string]> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = <any>await axiosFileInstance({
      url: `files/v1/photo/merchant`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return [null, response?.file]
  } catch (error) {
    return [error as BaseError, null]
  }
}