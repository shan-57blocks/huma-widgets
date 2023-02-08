import React, { useCallback } from 'react'

import { useAppDispatch } from '../../../../../hooks/useRedux'
import { PoolInfoType } from '../../../../../utils/pool'
import { AllowListModal } from '../../../components/AllowListModal'
import {
  setCLBorrowError,
  setCLBorrowStep,
} from '../../store/creditLine.reducers'
import { CL_BORROW_STEP } from '../../store/creditLine.store'

type Props = {
  poolInfo: PoolInfoType
}

export function AllowList({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()

  const handleSuccess = useCallback(() => {
    dispatch(setCLBorrowStep(CL_BORROW_STEP.Terms))
  }, [dispatch])

  const handleError = useCallback(
    (errorMessage: string) => {
      dispatch(setCLBorrowError({ errorMessage }))
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
