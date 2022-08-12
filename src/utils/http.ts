/* eslint-disable prefer-promise-reject-errors */
import Axios, { AxiosRequestConfig } from 'axios';
import { ElMessage as Message } from 'element-plus';
import NProgress from '@/config/nprogress-config';

let requestCount = 0;

const http = Axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 15000,
  withCredentials: true,
  validateStatus(status) {
    return status >= 200 && status <= 500;
  },
});

function requestInterceptor(config: AxiosRequestConfig) {
  NProgress.start();
  requestCount += 1;
  return config;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function requestErrorInterceptor(error: any) {
  Message.error(error);
  requestCount -= 1;
  return Promise.reject(error);
}

async function responseInterceptor(response: HttpResponse<object>) {
  requestCount -= 1;
  if (requestCount < 1) {
    NProgress.done();
  }
  // eslint-disable-next-line prefer-const
  let { data } = response;
  const { success } = data;
  if (success) {
    return Promise.resolve(response);
  }
  return Promise.reject(data);
}

function responseErrorInterceptor(error: { isAxiosError?: boolean; message?: string }) {
  requestCount -= 1;
  if (requestCount < 1) {
    NProgress.done();
  }
  if (Axios.isCancel(error)) {
    return Promise.reject({ message: 'cancel request' });
  }
  if (error.isAxiosError) {
    return Promise.reject({ ...error, errMessage: error.message });
  }
  return Promise.reject({ ...error, errMessage: '服务异常，请稍后尝试！' });
}

http.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
http.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default http;
