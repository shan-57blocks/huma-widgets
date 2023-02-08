import { datadogRum } from '@datadog/browser-rum'
import { CHAINS } from './chain'

export const initRUMLogger = () => {
  datadogRum.init({
    applicationId: process.env.REACT_APP_DATADOG_APPLICATION_ID!,
    clientToken: process.env.REACT_APP_DATADOG_CLIENT_TOKEN!,
    site: 'datadoghq.com',
    service: 'huma-dapp',
    env: process.env.NODE_ENV,
    version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: 'mask-user-input',
  })

  datadogRum.startSessionReplayRecording()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logError = (err: any, context?: Object) => {
  datadogRum.addError(err, { ...context })
  console.error(err)
}

export const logAction = (action: string, context?: Object) => {
  datadogRum.addAction(action, { ...context })
}

export const ddSetUserWalletInfo = (
  account: string | undefined,
  chainId: number | undefined,
) => {
  if (account) {
    datadogRum.setUserProperty('id', account)
    datadogRum.setUserProperty('account', account)
  }
  if (chainId) {
    datadogRum.setUserProperty('network', CHAINS[chainId]?.name)
  }
}
