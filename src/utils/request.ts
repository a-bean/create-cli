import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import { TResponse, EResponseCode } from '@/types/common';
import usePromise from '@/hooks/usePromise';

const { CancelToken } = axios;

const timeout = 1 * 60 * 1000;
const baseURL = (import.meta.env.VITE_REQUEST_PREFIX as string) || '/api';

const instance = axios.create({
  baseURL,
  timeout,
});

/**
 * 请求接口
 * @param config AxiosRequestConfig
 * @returns 固定返回 TResponse 格式; 在外部判断code 是否为 EResponseCode.success
 */
export const request = async <T = unknown>(config: AxiosRequestConfig) => {
  // 处理二进制的情况
  const resolveDownload = (res: AxiosResponse<TResponse<T>>) => {
    const { data } = res;
    const [resolve, P] = usePromise<TResponse<T>>();
    const reader = new FileReader();
    reader.readAsText(data as unknown as Blob, 'utf-8');
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string) as TResponse<T>;
        if (json) {
          resolve(json);
          return;
        }
      } catch (e) {
        console.log(e);
      }
      const reg = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const fileName = reg.exec(res.headers['content-disposition'])?.[1];

      const blob = new Blob([data as unknown as Blob], {
        type: res.headers['content-type'],
      });
      resolve({
        code: EResponseCode.success,
        data: {
          name: fileName,
          blob,
        },
        message: '',
      } as unknown as TResponse<T>);
    };
    return P;
  };
  // 是否是下载
  const isdownload = config.responseType === 'blob';

  try {
    const res = await instance.request<TResponse<T>>(config);
    let { data } = res;

    if (isdownload) {
      data = await resolveDownload(res);
    }
    return data;
  } catch (e) {
    const res = (e as AxiosError<TResponse<T>>).response!;
    if (!res) {
      return {
        code: EResponseCode.error,
        message: (e as AxiosError).message,
      } as TResponse<T>;
    }

    let { data } = res;
    if (isdownload) {
      data = await resolveDownload(res);
    }
    if (typeof data === 'string') {
      return {
        code: EResponseCode.error,
        message: (e as AxiosError).message || res.statusText,
      } as TResponse<T>;
    }
    return (
      data ||
      ({
        code: EResponseCode.error,
        message: (e as AxiosError).message,
      } as TResponse<T>)
    );
  }
};

/**
 * 上传文件, 附带abort 和 onProgress
 * @param params 上传参数 AxiosRequestConfig
 * @returns
 */
export const uploadRequest = <T>(params: AxiosRequestConfig) => {
  let abort: Canceler = () => {};
  const cbs: ((progress: ProgressEvent) => void)[] = [];
  const onProgress = (cb: (progress: ProgressEvent) => void) => {
    cbs.push(cb);
  };
  const res = request<T>({
    ...params,
    onUploadProgress: (progress: ProgressEvent) => {
      cbs.forEach((cb) => {
        cb(progress);
      });
    },
    cancelToken: new CancelToken((c) => {
      abort = c;
    }),
  });
  // 没啥实际意义, 只是为了改类型
  const wraper = <T2>(P: T2) => {
    return P as T2 & { abort: Canceler; onProgress: typeof onProgress };
  };
  const r = wraper(res);
  r.abort = abort;
  r.onProgress = onProgress;
  return r;
};
