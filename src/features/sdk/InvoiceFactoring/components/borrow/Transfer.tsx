import React, { useCallback } from 'react'

import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { toBigNumber, upScale } from '../../../../../utils/number'
import { PoolInfoType } from '../../../../../utils/pool'
import { TransferModal } from '../../../components/TransferModal'
import { setIFBorrowNextStep } from '../../store/invoiceFactoring.reducers'
import { selectIFState } from '../../store/receivableFactoring.selectors'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function Transfer({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { requestLoan } = useAppSelector(selectIFState)
  const { decimals } = poolInfo.poolUnderlyingToken
  const requestLoanBigNumber = toBigNumber(upScale(requestLoan!, decimals))

  const handleSuccess = useCallback(() => {
    dispatch(setIFBorrowNextStep())
  }, [dispatch])

  return (
    <TransferModal
      poolInfo={poolInfo}
      title='Transfer Invoice and Money'
      method='drawdownWithReceivable'
      params={[requestLoanBigNumber, poolInfo.assetAddress, tokenId]}
      handleSuccess={handleSuccess}
    />
  )
}
