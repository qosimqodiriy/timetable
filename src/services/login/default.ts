import { type LoginModel } from './model'

export function getLogin_DEFAULT(): LoginModel {
  const object: LoginModel = {
    phone: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    code: '',
    newPassword: '',
  }

  return object
}