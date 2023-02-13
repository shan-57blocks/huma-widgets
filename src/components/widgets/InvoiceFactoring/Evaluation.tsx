import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'

import { useAppDispatch } from '../../../hooks/useRedux'
import EAService, { EAPayloadType } from '../../../services/EAService'
import { ChainEnum } from '../../../utils/chain'
import { EARejectMessage, EARejectReason } from '../../../utils/const'
import { downScale, toBigNumber } from '../../../utils/number'
import { PoolInfoType } from '../../../utils/pool'
import { CustomError } from '../../../utilTypes'
import { LoadingModal } from '../components'
import { setApproveInfo, setError, setStep } from '../store/widgets.reducers'
import { WIDGET_STEP } from '../store/widgets.store'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function Evaluation({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account, chainId, isActive } = useWeb3React()

  console.log(3333, account)
  console.log(6666, isActive)

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
        dispatch(setApproveInfo(result))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.cause?.applicationRejected) {
          if (chainId === ChainEnum.Goerli) {
            dispatch(setStep(WIDGET_STEP.AddToAllowList))
          } else {
            dispatch(
              setError({
                errorMessage: EARejectMessage,
                errorReason: EARejectReason,
              }),
            )
          }
        } else {
          const error = e as CustomError
          dispatch(
            setError({
              errorMessage: error.message,
            }),
          )
        }
      }
    }
    // fetchData()
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
