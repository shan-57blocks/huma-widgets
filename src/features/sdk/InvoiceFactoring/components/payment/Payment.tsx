import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect } from 'react'

import { HumaModal, HumaModalHeader } from '../../../../../components/humaModal'
import { sendTxAtom, txAtom } from '../../../../../hooks/useContractFunction'
import { CreditRecordType } from '../../../../../hooks/usePoolContract'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { logAction } from '../../../../../utils/ddLogger'
import { PoolInfoType } from '../../../../../utils/pool'
import { isTxFailed } from '../../../../../utils/transaction'
import { ErrorModal } from '../../../components'
import {
  resetAfterSuccess,
  setIFPaymentError,
} from '../../store/invoiceFactoring.reducers'
import {
  selectIFErrorMessage,
  selectIFPaymentAmount,
  selectIFPaymentStep,
} from '../../store/receivableFactoring.selectors'
import { IF_PAYMENT_STEP } from '../../store/receivableFactoring.store'
import { ApproveAllowance } from './ApproveAllowance'
import { Payback } from './Payback'
import { Success } from './Success'
import { Transfer } from './Transfer'

type Props = {
  creditRecord: CreditRecordType
  poolInfo: PoolInfoType
  isOpen: boolean
  handleClose: () => void
  handleSuccess: (blockNumber: number) => void
}

export function Payment({
  creditRecord,
  poolInfo,
  isOpen,
  handleClose,
  handleSuccess,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const paymentStep = useAppSelector(selectIFPaymentStep)
  const errorMessage = useAppSelector(selectIFErrorMessage)
  const paymentAmount = useAppSelector(selectIFPaymentAmount)
  const [{ state, txReceipt, failReason }] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)

  useEffect(() => {
    if (isTxFailed(state) && failReason) {
      dispatch(setIFPaymentError(failReason))
    }
  }, [dispatch, failReason, state])

  useEffect(() => {
    if (paymentStep === IF_PAYMENT_STEP.Done && txReceipt) {
      handleSuccess(txReceipt.blockNumber)
      logAction('Invoice factoring payment', {
        amount: paymentAmount,
      })
    }
  }, [handleSuccess, paymentAmount, paymentStep, txReceipt])

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
      {paymentStep === IF_PAYMENT_STEP.Payback && (
        <Payback creditRecord={creditRecord} poolInfo={poolInfo} />
      )}
      {paymentStep === IF_PAYMENT_STEP.ApproveAllowance && (
        <ApproveAllowance poolInfo={poolInfo} />
      )}
      {paymentStep === IF_PAYMENT_STEP.TransferMoney && (
        <Transfer poolInfo={poolInfo} />
      )}
      {paymentStep === IF_PAYMENT_STEP.Done && (
        <Success poolInfo={poolInfo} handleAction={handleCloseModal} />
      )}
      {paymentStep === IF_PAYMENT_STEP.Error && (
        <ErrorModal
          title='Make Payment'
          errorMessage={errorMessage}
          handleOk={handleCloseModal}
        />
      )}
    </HumaModal>
  )
}
