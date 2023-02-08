import { RootState } from '../../../../store'

export const selectIFState = (state: RootState) => state.invoiceFactoring
export const selectIFBorrowStep = (state: RootState) =>
  state.invoiceFactoring.borrowStep
export const selectIFPaymentStep = (state: RootState) =>
  state.invoiceFactoring.paymentStep
export const selectIFErrorMessage = (state: RootState) =>
  state.invoiceFactoring.errorMessage
export const selectIFApproveInfo = (state: RootState) =>
  state.invoiceFactoring.approveInfo
export const selectIFAlreadyApproved = (state: RootState) =>
  state.invoiceFactoring.alreadyApproved
export const selectIFRequestLoan = (state: RootState) =>
  state.invoiceFactoring.requestLoan
export const selectIFPaymentAmount = (state: RootState) =>
  state.invoiceFactoring.paymentAmount
