export interface LoginModel {
    phone: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    code: string;
    newPassword: string;
}

export interface LoginResponseModel {
    token: string;
}