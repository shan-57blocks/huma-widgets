import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../../../hooks/useRedux'
import { PoolInfoType } from '../../../../../utils/pool'
import { AllowListModal } from '../../../components/AllowListModal'
import {
  setIFBorrowError,
  setIFBorrowStep,
} from '../../store/invoiceFactoring.reducers'
import { IF_BORROW_STEP } from '../../store/receivableFactoring.store'

type Props = {
  poolInfo: PoolInfoType
}

export function AllowList({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    dispatch(setIFBorrowStep(IF_BORROW_STEP.Terms))
  }, [dispatch])

  const handleError = useCallback(
    (errorMessage: string) => {
      dispatch(setIFBorrowError({ errorMessage }))
    },
    [dispatch],
  )

  return (
    <AllowListModal
      poolInfo={poolInfo}
      handleSuccess={handleSuccess}
      handleError={handleError}
    />
  )
}
