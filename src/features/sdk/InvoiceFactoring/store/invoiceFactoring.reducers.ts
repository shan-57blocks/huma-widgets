import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ApproveInfoType } from '../../../../services/EAService'
import {
  IF_BORROW_STEP,
  IF_PAYMENT_STEP,
  initialRFState,
} from './receivableFactoring.store'

export const invoiceFactoringSlice = createSlice({
  name: 'invoiceFactoring',
  initialState: initialRFState,
  reducers: {
    resetAfterSuccess: (state) => {
      state.errorReason = ''
      state.errorMessage = ''
      state.borrowStep = IF_BORROW_STEP.Terms
      state.approveInfo = undefined
      state.alreadyApproved = false
      state.requestLoan = undefined
      state.chargedFees = undefined
      state.requestLoanNet = undefined
      state.remainder = undefined
      state.paymentStep = IF_PAYMENT_STEP.Payback
      state.paymentAmount = undefined
    },
    setIFBorrowStep: (state, { payload }: PayloadAction<IF_BORROW_STEP>) => {
      state.borrowStep = payload
    },
    setIFBorrowNextStep: (state) => {
      state.borrowStep += 1
    },
    setIFBorrowError: (
      state,
      {
        payload,
      }: PayloadAction<{ errorMessage: string; errorReason?: string }>,
    ) => {
      state.errorMessage = payload.errorMessage
      state.errorReason = payload.errorReason
      state.borrowStep = IF_BORROW_STEP.Error
    },
    setIFApproveInfo: (state, { payload }: PayloadAction<ApproveInfoType>) => {
      state.approveInfo = payload
      if (payload.creditLimit > 0) {
        state.borrowStep = IF_BORROW_STEP.Loan
      } else {
        state.errorMessage =
          'Sorry, there was an error with your transaction. Please try submitting again.'
        state.borrowStep = IF_BORROW_STEP.Error
      }
    },
    setIFAlreadyApproved: (state, { payload }: PayloadAction<boolean>) => {
      state.alreadyApproved = payload
      state.borrowStep = IF_BORROW_STEP.Loan
    },
    setIFBorrowAmount: (
      state,
      {
        payload,
      }: PayloadAction<{
        requestLoan: number
        chargedFees: number
        remainder: number
      }>,
    ) => {
      state.requestLoan = payload.requestLoan
      state.chargedFees = payload.chargedFees
      state.remainder = payload.remainder
      state.requestLoanNet = payload.requestLoan - payload.chargedFees
      state.borrowStep = IF_BORROW_STEP.Confirm
    },
    setIFPaymentStep: (state, { payload }: PayloadAction<IF_PAYMENT_STEP>) => {
      state.paymentStep = payload
    },
    setIFPaymentAmount: (
      state,
      {
        payload,
      }: PayloadAction<{ paymentAmount: number; remainDueAmount: number }>,
    ) => {
      state.paymentAmount = payload.paymentAmount
      state.remainDueAmount = payload.remainDueAmount
    },
    setIFPaymentNextStep: (state) => {
      state.paymentStep += 1
    },
    setIFPaymentError: (state, { payload }: PayloadAction<string>) => {
      state.errorMessage = payload
      state.paymentStep = IF_PAYMENT_STEP.Error
    },
  },
})

export const {
  setIFBorrowStep,
  setIFBorrowNextStep,
  setIFBorrowError,
  setIFApproveInfo,
  setIFAlreadyApproved,
  setIFBorrowAmount,
  setIFPaymentError,
  setIFPaymentStep,
  setIFPaymentAmount,
  setIFPaymentNextStep,
  resetAfterSuccess,
} = invoiceFactoringSlice.actions

export default invoiceFactoringSlice.reducer
