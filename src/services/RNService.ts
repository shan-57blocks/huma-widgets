import configUtil from '../utils/config'
import { logError } from '../utils/ddLogger'
import request from '../utils/request'

export type RequestInfoType = {
  expectedAmount: string
  payer: {
    type: string
    value: string
  }
  payee: {
    type: string
    value: string
  }
}

const getRequestInfo = async (requestId: string, chainId: number) => {
  try {
    const { data } = await request.get<RequestInfoType>(
      `${configUtil.getRNBaseUrl(chainId)}/request?id=${requestId}`,
    )
    return data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError(error, { message: 'Error get request info', requestId })
    throw error
  }
}

const RNService = {
  getRequestInfo,
}
export default RNService
