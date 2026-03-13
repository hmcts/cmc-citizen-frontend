import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import * as https from 'https'
import axiosRetry from 'axios-retry'
import * as config from 'config'

const timeout: number = config.get<number>('http.timeout')
const maxAttempts: number = config.get<number>('requestRetry.maxAttempts')

export interface RequestOptions {
  uri?: string
  url?: string
  method?: string
  body?: any
  json?: boolean
  headers?: Record<string, string>
  resolveWithFullResponse?: boolean
  encoding?: string | null
  form?: Record<string, string>
  auth?: { username: string; password: string }
  qs?: Record<string, string>
  simple?: boolean
  fullResponse?: boolean
  maxAttempts?: number
  timeout?: number
  ca?: string | Buffer
}

function normalizeOptions (uriOrOptions: string | RequestOptions, second?: RequestOptions): RequestOptions {
  if (second) {
    return { uri: typeof uriOrOptions === 'string' ? uriOrOptions : (uriOrOptions.uri ?? uriOrOptions.url), ...second }
  }
  if (typeof uriOrOptions === 'string') {
    return { uri: uriOrOptions }
  }
  return { ...uriOrOptions }
}

function toAxiosConfig (options: RequestOptions, method: Method): AxiosRequestConfig {
  const url = options.uri ?? options.url
  if (!url) throw new Error('uri or url is required')
  const cfg: AxiosRequestConfig = {
    method,
    url,
    timeout: options.timeout ?? timeout,
    headers: options.headers ?? {},
    params: options.qs,
    maxRedirects: 0,
    validateStatus: () => true
  }
  if (options.auth) {
    cfg.auth = options.auth
  }
  if (method !== 'get' && method !== 'head') {
    if (options.form) {
      const params = new URLSearchParams()
      for (const [k, v] of Object.entries(options.form)) params.append(k, v)
      cfg.data = params
      cfg.headers = { ...cfg.headers, 'Content-Type': 'application/x-www-form-urlencoded' }
    } else if (options.body !== undefined) {
      cfg.data = options.body
      if (options.json !== false) {
        cfg.headers = { ...cfg.headers, 'Content-Type': 'application/json' }
      }
    }
  }
  if (options.encoding === null) {
    cfg.responseType = 'arraybuffer'
  }
  if (options.ca) {
    cfg.httpsAgent = new https.Agent({ ca: options.ca })
  }
  return cfg
}

function wrap (resolveWithFullResponse: boolean): (response: any) => any {
  return (response: any) => {
    if (resolveWithFullResponse) {
      const body = response.data
      const statusCode = response.status
      return { statusCode, body, headers: response.headers }
    }
    return response.data
  }
}

export type RequestAPI = {
  get: (uriOrOptions: string | RequestOptions) => Promise<any>
  post: (uriOrOptions: string | RequestOptions) => Promise<any>
  put: (uriOrOptions: string | RequestOptions) => Promise<any>
  patch: (uriOrOptions: string | RequestOptions) => Promise<any>
  del?: (uriOrOptions: string | RequestOptions) => Promise<any>
  delete?: (uriOrOptions: string | RequestOptions) => Promise<any>
  head?: (uriOrOptions: string | RequestOptions) => Promise<any>
  defaults: (defaults: Partial<RequestOptions>) => RequestAPI
} & ((options: RequestOptions) => Promise<any>)

function createClient (defaultOptions: Partial<RequestOptions> = {}, retries = maxAttempts): RequestAPI {
  const axiosInstance: AxiosInstance = axios.create({
    timeout: defaultOptions.timeout ?? timeout,
    headers: defaultOptions.headers
  })
  if (retries > 0) {
    axiosRetry(axiosInstance, {
      retries,
      retryCondition: (err) => axiosRetry.isNetworkOrIdempotentRequestError(err) || (err.response?.status >= 500),
      retryDelay: axiosRetry.exponentialDelay
    })
  }

  const request = (method: Method) => (uriOrOptions: string | RequestOptions, second?: RequestOptions): Promise<any> => {
    const options = { ...defaultOptions, ...normalizeOptions(uriOrOptions, second) }
    const resolveWithFullResponse = options.resolveWithFullResponse ?? options.fullResponse ?? false
    const axiosConfig = toAxiosConfig(options, method)
    return axiosInstance.request(axiosConfig).then((response) => {
      if (options.simple !== false && response.status >= 400) {
        const err: any = new Error(`Request failed with status ${response.status}`)
        err.statusCode = response.status
        err.response = response
        err.body = response.data
        err.error = response.data
        throw err
      }
      return wrap(resolveWithFullResponse)(response)
    })
  }

  const deleteFn = request('delete')
  const api: RequestAPI = {
    get: request('get'),
    post: request('post'),
    put: request('put'),
    patch: request('patch'),
    del: deleteFn,
    delete: deleteFn,
    head: request('head'),
    defaults (defaults: Partial<RequestOptions>) {
      const merged = { ...defaultOptions, ...defaults }
      return createClient(merged, merged.maxAttempts ?? retries)
    }
  }

  const callable = (options: RequestOptions): Promise<any> => {
    const method = (options.method ?? 'GET').toLowerCase() as Method
    return (api as any)[method === 'delete' ? 'del' : method](options)
  }
  return Object.assign(callable, api) as RequestAPI
}

export const request = createClient({}, maxAttempts)
export const noRetryRequest = createClient({}, 0)
