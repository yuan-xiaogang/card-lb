import { MAINURL, TESTURL } from '@/config/index';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
// import { Toast } from "vant";

declare type Methods = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"
declare interface Datas {
    method?: Methods
    [key: string]: any
  }
const baseUrl = process.env.NODE_ENV === 'production'? MAINURL: TESTURL

// 失败回调
const requestFail = (res: any) => {
    const errStr = '网络繁忙或者系统内部错误!'
    return {
        err: console.error(res),
        ...res.data
    }
}
const defaultConfig: object = {
    baseURL: baseUrl
}
class HttpRequest {
    public quene: any
    public constructor() {
        this.quene = {}
    }
    public async request(options: AxiosRequestConfig, isOpenInterceptor: boolean = true) {
        const instance = axios.create({...defaultConfig});
        if (isOpenInterceptor) {
            await this.interceptors(instance, options.url as string)
        }
        return instance(options)
    }
    private destroy(url: string) {
        delete this.quene[url]
        if (!Object.keys(this.quene).length) {
            // 隐藏loading
        }
    }
    private interceptors(instance: any, url:string) {
        // 请求拦截
        instance.interceptors.request.use((config: AxiosRequestConfig) => {
            if (!Object.keys(this.quene).length) {
                // 全局loading
            }
            if (url) {
                this.quene[url] = true
            }
            return config
        },(error:any) => {
            console.error(error)
        })
        // 响应拦截
        instance.interceptors.response.use((res: any) => {
            if (url) {
                this.destroy(url)
            }
            const {data, status} = res
            if (status === 200 && data && data.code === 200 && data.success) {
                return data
            }
            return requestFail(res) // 失败回调
        }, (error:any) => {
            if (url) {
                this.destroy(url)
            }
            console.error(error);
            // Toast.fail(error);
        })
    }


}
const http = new HttpRequest();

const Axios = async (options: AxiosRequestConfig, isOpenInterceptor: boolean = true) => {
    return http.request(options, isOpenInterceptor)
}

export default Axios


