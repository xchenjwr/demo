import axios from "axios";

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: "http://120.77.98.123:7001",
    timeout: 5000,
  });
  instance.defaults.retry = 3;
  instance.defaults.retryDelay = 0;
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(
    (config) => {
      if (sessionStorage.token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers["Authorization"] = "Bearer " + sessionStorage.token;
      }
      return config;
    },
    (err) => {
      console.log(err);
      return Promise.reject(err);
    }
  );

  // 2.2.响应拦截
  instance.interceptors.response.use(
    (res) => {
      return res.data;
    },
    (err) => {
      let config = err.config;
      if (!config || !config.retry) {
        console.log((err && err.data && err.data.msg) || "接口异常");
        return Promise.reject(err);
      }
      // 设置请求超时次数
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount >= config.retry) {
        console.log((err && err.data && err.data.msg) || "接口异常");
        return Promise.reject(err);
      }
      config.__retryCount += 1;
      let backoff = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, config.retryDelay || 1);
      });
      return backoff.then(() => {
        return instance(config);
      });
    }
  );

  // 3.发送真正的网络请求
  return instance(config);
}
