// can we just get this from IDPE
// directly or does Quartz have special
// permissions / knowledge?
import {
  Account as GenAccount,
  BillingNotifySettings as GenBillingNotifySettings,
  Region as GenRegion,
  History as GenHistory,
  BillingDate as GenBillingDate,
  ZuoraParams,
} from 'src/client/unityRoutes'
export {
  BillingContact,
  Invoice,
  Invoices,
  PaymentMethod,
  PaymentMethods,
  ZuoraParams,
} from 'src/client/unityRoutes'
import {RemoteDataState} from 'src/types'

export type ZuoraResponseHandler = (response: ZuoraResponse) => void

export interface ZuoraClient {
  render: (
    zuoraParams: ZuoraParams,
    formFields: {},
    onSubmit: ZuoraResponseHandler
  ) => void
  submit: () => void
}

export interface Region extends GenRegion {
  status: RemoteDataState
}

export interface History extends GenHistory {
  status: RemoteDataState
}
export interface Account extends GenAccount {
  status: RemoteDataState
}

export interface BillingNotifySettings extends GenBillingNotifySettings {
  status: RemoteDataState
}

export interface BillingDate extends GenBillingDate {
  status: RemoteDataState
}

// Current PayAsYouGo Props
export interface Props {
  account: Account // could we possibly combine Account with BillingContact?
  billingNotifySettings: BillingNotifySettings // separate endpoint w/ put [x]
  email: string // where does this come from?
  history: History
  region: Region
}

export interface ZuoraResponse {
  success: boolean
  responseFrom: string
  refId: string
}
