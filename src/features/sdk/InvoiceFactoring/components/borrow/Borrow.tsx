import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect } from 'react'

import { HumaModal, HumaModalHeader } from '../../../../../components/humaModal'
import { sendTxAtom, txAtom } from '../../../../../hooks/useContractFunction'
import {
  CreditRecordType,
  ReceivableInfoType,
} from '../../../../../hooks/usePoolContract'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { logAction } from '../../../../../utils/ddLogger'
import { PoolInfoType } from '../../../../../utils/pool'
import { isTxFailed } from '../../../../../utils/transaction'
import { ErrorModal } from '../../../components'
import {
  resetAfterSuccess,
  setIFBorrowError,
} from '../../store/invoiceFactoring.reducers'
import {
  selectIFBorrowStep,
  selectIFErrorMessage,
  selectIFRequestLoan,
} from '../../store/receivableFactoring.selectors'
import { IF_BORROW_STEP } from '../../store/receivableFactoring.store'
import { AllowList } from './AllowList'
import { ApproveNFT } from './ApproveNFT'
import { CheckingEA } from './CheckingEA'
import { Confirm } from './Confirm'
import { Loan } from './Loan'
import { Success } from './Success'
import { Transfer } from './Transfer'

type Props = {
  creditRecord: CreditRecordType
  receivableInfo: ReceivableInfoType
  poolInfo: PoolInfoType
  isOpen: boolean
  tokenId: string
  handleClose: () => void
  handleSuccess: (blockNumber: number) => void
}

export function Borrow({
  creditRecord,
  receivableInfo,
  poolInfo,
  tokenId,
  isOpen,
  handleClose,
  handleSuccess,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const borrowStep = useAppSelector(selectIFBorrowStep)
  const errorMessage = useAppSelector(selectIFErrorMessage)
  const requestLoan = useAppSelector(selectIFRequestLoan)
  const [{ state, failReason, txReceipt }] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)

  useEffect(() => {
    if (isTxFailed(state) && failReason) {
      dispatch(setIFBorrowError({ errorMessage: failReason }))
    }
  }, [dispatch, failReason, state])

  useEffect(() => {
    if (borrowStep === IF_BORROW_STEP.Done && txReceipt) {
      handleSuccess(txReceipt.blockNumber)
      logAction('Invoice factoring get paid', {
        amount: requestLoan,
      })
    }
  }, [handleSuccess, borrowStep, txReceipt, requestLoan])

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetAfterSuccess())
    handleClose()
  }, [dispatch, handleClose, reset])

  // when close modal, return null to make sure all the states are reset
  if (!isOpen) {
    return null
  }

  return (
    <HumaModal
      isOpen={isOpen}
      overflowY='auto'
      onClose={handleCloseModal}
      width='480px'
      padding='30px 40px'
      disableBackdropClick
    >
      <HumaModalHeader onClose={handleCloseModal} height={0} />
      {borrowStep === IF_BORROW_STEP.Terms && (
        <CheckingEA
          creditRecord={creditRecord}
          receivableInfo={receivableInfo}
          poolInfo={poolInfo}
          tokenId={tokenId}
        />
      )}
      {borrowStep === IF_BORROW_STEP.Loan && (
        <Loan
          creditRecord={creditRecord}
          poolInfo={poolInfo}
          handleOk={handleCloseModal}
        />
      )}
      {borrowStep === IF_BORROW_STEP.Confirm && (
        <Confirm poolInfo={poolInfo} tokenId={tokenId} />
      )}
      {borrowStep === IF_BORROW_STEP.ApproveNFT && (
        <ApproveNFT poolInfo={poolInfo} tokenId={tokenId} />
      )}
      {borrowStep === IF_BORROW_STEP.TransferMoney && (
        <Transfer poolInfo={poolInfo} tokenId={tokenId} />
      )}
      {borrowStep === IF_BORROW_STEP.Done && (
        <Success handleAction={handleCloseModal} />
      )}
      {borrowStep === IF_BORROW_STEP.Error && (
        <ErrorModal
          title='Invoice Checking'
          errorMessage={errorMessage}
          handleOk={handleCloseModal}
        />
      )}
      {borrowStep === IF_BORROW_STEP.AddToAllowList && (
        <AllowList poolInfo={poolInfo} />
      )}
    </HumaModal>
  )
}
