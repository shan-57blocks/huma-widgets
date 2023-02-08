import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'

import {
  CreditRecordType,
  ReceivableInfoType,
} from '../../../../../hooks/usePoolContract'
import { useAppDispatch } from '../../../../../hooks/useRedux'
import EAService, { EAPayloadType } from '../../../../../services/EAService'
import { ChainEnum } from '../../../../../utils/chain'
import { EARejectMessage, EARejectReason } from '../../../../../utils/const'
import { CreditState } from '../../../../../utils/credit'
import { downScale, toBigNumber } from '../../../../../utils/number'
import { PoolInfoType } from '../../../../../utils/pool'
import { CustomError } from '../../../../../utilTypes'
import { LoadingModal } from '../../../components/LoadingModal'
import {
  setIFAlreadyApproved,
  setIFApproveInfo,
  setIFBorrowError,
  setIFBorrowStep,
} from '../../store/invoiceFactoring.reducers'
import { IF_BORROW_STEP } from '../../store/receivableFactoring.store'

type Props = {
  creditRecord: CreditRecordType
  receivableInfo: ReceivableInfoType
  poolInfo: PoolInfoType
  tokenId: string
}

export function CheckingEA({
  creditRecord,
  receivableInfo,
  poolInfo,
  tokenId,
}: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, chainId } = useWeb3React()

  useEffect(() => {
    if (
      creditRecord.state > CreditState.Approved &&
      receivableInfo.receivableParam.toString() === tokenId &&
      receivableInfo.receivableAsset.toLowerCase() ===
        poolInfo.assetAddress?.toLowerCase()
    ) {
      dispatch(setIFAlreadyApproved(true))
    }
  }, [
    dispatch,
    creditRecord.state,
    poolInfo.assetAddress,
    receivableInfo.receivableAsset,
    receivableInfo.receivableParam,
    tokenId,
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload: EAPayloadType = {
          poolAddress: poolInfo.pool,
          borrowerWalletAddress: account,
          receivableAddress: poolInfo.assetAddress,
          receivableParam: toBigNumber(tokenId).toHexString(),
        }
        const result = await EAService.approve(payload)
        result.receivableAmount = downScale<number>(
          result.receivableAmount,
          result.tokenDecimal,
        )
        result.creditLimit = downScale<number>(
          result.creditLimit,
          result.tokenDecimal,
        )
        dispatch(setIFApproveInfo(result))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.cause?.applicationRejected) {
          if (chainId === ChainEnum.Goerli) {
            dispatch(setIFBorrowStep(IF_BORROW_STEP.AddToAllowList))
          } else {
            dispatch(
              setIFBorrowError({
                errorMessage: EARejectMessage,
                errorReason: EARejectReason,
              }),
            )
          }
        } else {
          const error = e as CustomError
          dispatch(
            setIFBorrowError({
              errorMessage: error.message,
            }),
          )
        }
      }
    }
    fetchData()
  }, [
    account,
    chainId,
    dispatch,
    poolInfo.assetAddress,
    poolInfo.pool,
    tokenId,
  ])

  return (
    <LoadingModal
      title='Checking Invoice'
      description='Checking if the invoice qualifies for factoring...'
    />
  )
}
