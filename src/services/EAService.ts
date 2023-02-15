import configUtil from '../utils/config'
import { logError } from '../utils/ddLogger'
import { EARejectionError } from '../utils/errors'
import request from '../utils/request'

type EAPayloadStream = {
  payeeAddress: string
  payerAddress: string
  superToken: string
}

export type EAPayload = EAPayloadStream

export type ApproveInfoType = {
  aprInBps: number
  creditLimit: number
  intervalInDays: number
  receivableAmount: number
  receivableAsset: string
  receivableParam: number | string
  remainingPeriods: number
  tokenDecimal: number
  tokenName: string
  tokenSymbol: string
}

const approve = async (payload: EAPayload) => {
  try {
    const { data } = await request.post(
      `${configUtil.EABaseUrl}/underwriter/underwrite`,
      payload,
    )
    if (data.rejectionReason?.length) {
      throw new EARejectionError()
    }

    return data as ApproveInfoType

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorPayload = {
      ...payload,
      message: 'Error approve wallet by underwrite',
    }
    logError(error, errorPayload)
    throw error
  }
}

const addToAllowList = async (
  walletAddress: string,
  poolAddress: string,
  userName?: string,
) => {
  try {
    await request.post(`${configUtil.EAAllowListUrl}/user/create`, {
      wallet_address: walletAddress,
      pool_address: poolAddress,
      user_name: userName ?? '',
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logError(error, {
      message: 'Error add to allow list',
      poolAddress,
      userName,
    })
    throw new Error(error.message)
  }
}

const EAService = {
  approve,
  addToAllowList,
}
export default EAService
