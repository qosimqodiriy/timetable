import axios from "axios";
import { logout_HANDLER } from "./handler";
import { ElNotification } from "element-plus";

// let baseURL = "http://68.183.8.75:8080/api";
let baseURL = "http://136.114.26.167:8080/api";


export const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    for (const key in config.params) {
      if (Object.prototype.hasOwnProperty.call(config.params, key)) {
        const element = config.params[key];
        if (!element && typeof element != "boolean") delete config.params[key];
      }
    }
    
    const token = localStorage.getItem("token");
    if (config.url.includes("NO_TOKEN")) config.headers.authorization = "";
    else if (token) config.headers.authorization = `Bearer ${token}`;
    config.url = config.url.replace("/NO_TOKEN", "");

    return config;
  },

  (error) => {
    alert("Axios request error");
    
    ElNotification({
      title: "",
      type: "error",
      message: error.errorDescription,
    });

    console.log("Error: " + error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response.data.response;
  },

  (error) => {
    console.log("Axios error");
    console.log(error);
    
    if(!error.errorDescription) return;
    // if(error.status === 401) logout_HANDLER(true)

    ElNotification({
      title: "",
      type: "error",
      message: error.errorDescription,
    });


    return Promise.reject(error);
  }
);
