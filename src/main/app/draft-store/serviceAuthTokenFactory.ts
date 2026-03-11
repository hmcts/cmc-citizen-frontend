import { ServiceAuthToken } from './serviceAuthToken'

export interface ServiceAuthTokenFactory {
  get (): Promise<ServiceAuthToken>
}
