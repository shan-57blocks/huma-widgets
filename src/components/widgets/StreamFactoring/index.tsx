import { PoolInfoType } from '../../../utils/pool'
import Widget from '../Widget'
import { StreamFactoringBorrow } from './Borrow'

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
      <StreamFactoringBorrow {...props} />
    </Widget>
  )
}
