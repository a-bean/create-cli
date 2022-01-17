import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { TResponse, EResponseCode } from '@/types/common';

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
  try {
    const { data } = await instance.request<TResponse<T>>(config);
    return data;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { data } = (e as AxiosError<TResponse<T>>).response!;
    return (
      data ||
      ({
        code: EResponseCode.error,
        message: (e as AxiosError).message,
      } as TResponse<T>)
    );
  }
};
