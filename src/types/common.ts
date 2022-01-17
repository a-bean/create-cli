export interface TResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export const enum EResponseCode {
  /** 错误code */
  error = -1,
  /** 错误正常code */
  success = 0,
  /** 项目不存在code */
  noProject = 1404,
}

export enum EAlignType {
  center = 'center',
  left = 'left',
  right = 'right',
  default = 'left',
}

export type VoidFn<T = unknown> = (arg: T) => void;
