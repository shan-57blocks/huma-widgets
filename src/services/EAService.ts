import { sleep } from '../utils/common'
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

export type ApproveInfo = {
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
  await sleep(3000)
  return {
    tokenSymbol: 'USDC',
    tokenName: 'TestToken',
    tokenDecimal: 6,
    creditLimit: 100000000,
    intervalInDays: 28,
    remainingPeriods: 1,
    aprInBps: 0,
    receivableAsset: '0x9aEBB4B8abf7afC96dC00f707F766499C5EbeDF1',
    receivableParam:
      '0xce03e6afc20ace36be2b60614a0e92eded16639b88c8c31c2061aa5c8a62dfe0',
    receivableAmount: 100000000,
  } as ApproveInfo

  try {
    const { data } = await request.post(
      `${configUtil.EABaseUrl}/underwriter/underwrite`,
      payload,
    )
    if (data.rejectionReason?.length) {
      throw new EARejectionError()
    }

    return data as ApproveInfo

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
