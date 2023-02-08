import { ApproveInfoType } from '../../../../services/EAService'

export enum IF_BORROW_STEP {
  Terms = 0,
  Loan = 1,
  Confirm = 2,
  ApproveNFT = 3,
  TransferMoney = 4,
  Done = 5,
  Error = 6,
  AddToAllowList = 7,
}

export enum IF_PAYMENT_STEP {
  Payback = 0,
  ApproveAllowance = 1,
  TransferMoney = 2,
  Done = 3,
  Error = 4,
}

export type ReceivableFactoringState = {
  borrowStep: IF_BORROW_STEP
  paymentStep: IF_PAYMENT_STEP
  approveInfo?: ApproveInfoType
  alreadyApproved: boolean
  requestLoan?: number
  chargedFees?: number
  requestLoanNet?: number
  remainder?: number
  paymentAmount?: number
  remainDueAmount?: number
  errorMessage?: string
  errorReason?: string
}

export const initialRFState: ReceivableFactoringState = {
  borrowStep: IF_BORROW_STEP.Terms,
  paymentStep: IF_PAYMENT_STEP.Payback,
  alreadyApproved: false,
}
