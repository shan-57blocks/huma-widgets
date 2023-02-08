import { useWeb3React } from '@web3-react/core'
import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { toBigNumber, upScale } from '../../../../../utils/number'
import { PoolInfoType } from '../../../../../utils/pool'
import { TransferModal } from '../../../components/TransferModal'
import { setIFPaymentNextStep } from '../../store/invoiceFactoring.reducers'
import { selectIFState } from '../../store/receivableFactoring.selectors'

type Props = {
  poolInfo: PoolInfoType
}

export function Transfer({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { decimals } = poolInfo.poolUnderlyingToken
  const { paymentAmount } = useAppSelector(selectIFState)
  const paymentBigNumber = toBigNumber(upScale(paymentAmount!, decimals))

  const handleSuccess = useCallback(() => {
    dispatch(setIFPaymentNextStep())
  }, [dispatch])

  return (
    <TransferModal
      poolInfo={poolInfo}
      method='makePayment'
      params={[account, paymentBigNumber]}
      handleSuccess={handleSuccess}
    />
  )
}
