/* eslint-disable @typescript-eslint/no-explicit-any */
type Method<T> = Extract<T, (...args: any[]) => any>
type Promisify<T> = T extends Promise<any> ? T : Promise<T>
export type Invoker<T> = <K extends keyof T & string>(
    method: K,
    ...prms: Parameters<Method<T[K]>>
) => Promisify<ReturnType<Method<T[K]>>>
