import { PoolInfoType } from '../../../utils/pool'
import Widget from '../Widget'
import { InvoiceFactoringBorrow } from './Borrow'

export type WidgetProps = {
  poolInfo: PoolInfoType
  isOpen: boolean
  tokenId: string
  handleClose: () => void
  handleSuccess: () => void
}

export function InvoiceFactoringBorrowWidget(props: WidgetProps) {
  return (
    <Widget>
      <InvoiceFactoringBorrow {...props} />
    </Widget>
  )
}
