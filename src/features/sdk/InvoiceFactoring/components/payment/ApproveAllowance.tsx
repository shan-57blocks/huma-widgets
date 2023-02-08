import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../../../hooks/useRedux'
import { PoolInfoType } from '../../../../../utils/pool'
import { setIFPaymentNextStep } from '../../store/invoiceFactoring.reducers'

import { ApproveAllowanceModal } from '../../../components/ApproveAllowanceModal'

type Props = {
  poolInfo: PoolInfoType
}

export function ApproveAllowance({ poolInfo }: Props): React.ReactElement {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    dispatch(setIFPaymentNextStep())
  }, [dispatch])

  return (
    <ApproveAllowanceModal poolInfo={poolInfo} handleSuccess={handleSuccess} />
  )
}
