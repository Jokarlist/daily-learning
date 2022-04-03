import axios from "axios";

const instance = axios.create({
  baseURL: "https://mallapi.duyiedu.com/",
});

instance.interceptors.request.use(
  (config) => config,
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    if (res.data.status === "fail") {
      return Promise.reject(res.data.msg);
    }

    const result = res.data.data;
    if (result.role === "coustomer") {
      // result.role = "customer";
      result.role = "admin";
    }

    return result;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;