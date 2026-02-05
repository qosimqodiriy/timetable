import { axiosInstance, type BaseError } from "."

export async function logout_API(): Promise<[null, string] | [BaseError, null]> {
  try {
    const response = <string> await axiosInstance.post('/users/v1/users/logout')

    return [null, response]
  } catch (error) {
    return [error as BaseError, null]
  }
}

export async function logout_HANDLER(api = true) {
  if (api) await logout_API();
  
  const _language = localStorage.getItem("_language");
  
  localStorage.clear()
  sessionStorage.clear()
  localStorage.setItem("_language", String(_language));
}