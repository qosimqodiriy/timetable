import axios from 'axios'

let baseURL = 'http://68.183.8.75:8080'


export const axiosFileInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

axiosFileInstance.interceptors.request.use(
  (config: any) => {
    for (const key in config.params) {
      if (Object.prototype.hasOwnProperty.call(config.params, key)) {
        const element = config.params[key];
        if (!element && typeof element != 'boolean') delete config.params[key];
      }
    }

    const token = localStorage.getItem('token')

    if (config.url.includes('/login')) {
      return config
    }

    if (config.url.includes('NO_TOKEN')) {
      config.headers.authorization = ''
    } else if (token) {
      config.headers.authorization = `Bearer ${token}`
    }

    config.url = config.url.replace('/NO_TOKEN', '')

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)