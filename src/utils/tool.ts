/**
 * 下载文件
 * @param filename 文件名
 * @param blob 下载文件的blob数据
 */
export const downloadFile = (filename: string, blob: Blob) => {
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // 5.释放这个临时的对象url
  window.URL.revokeObjectURL(url);
};

/**
 * 根据种子生成随机数
 * @param max 最大值
 * @param min 最小值
 * @param seed 种子值
 * @returns 随机数
 */
export function seedRandom(max: number, min: number, seed: number): number {
  const rMax = max || 1;
  const rMin = min || 0;

  const rSeed = (seed * 9301 + 49297) % 233280;
  const rnd = rSeed / 233280.0;
  return Math.round(min + (rnd * rMax - rMin));
}

/**
 * 判断一个值的类型是否是 type
 * @param param unknow
 * @param type type
 * @returns boolean
 */
export const isTargetType = (param: unknown, type: `[object ${string}]`) => {
  return Object.prototype.toString.call(param) === type;
};
/**
 * 判断一个值是否是boolean
 * @param param 参数
 * @returns boolean
 */
export const isBoolean = (param: unknown) => isTargetType(param, '[object Boolean]');
/**
 * 判断一个值是否是Object
 * @param param 参数
 * @returns boolean
 */
export const isObject = (param: unknown) => isTargetType(param, '[object Object]');
