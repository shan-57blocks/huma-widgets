import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { Box, css, LinearProgress, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'

import { TableActionButton } from '../../../../components/buttons'
import { HumaTable } from '../../../../components/HumaTable'
import { ReceiptIcon } from '../../../../components/icons'
import { useMQ } from '../../../../hooks/useMQ'
import {
  CreditRecordType,
  ReceivableInfoType,
} from '../../../../hooks/usePoolContract'
import { useRFPoolUnderlyingToken } from '../../../../hooks/useRFPoolContract'
import { getWalletAddressAbbr } from '../../../../utils/chain'
import { downScale, formatMoney } from '../../../../utils/number'
import { POOL_NAME } from '../../../../utils/pool'
import { timestampToLL } from '../../../../utils/time'
import { ColumnType } from '../../../../utilTypes'
import { useInvoice } from '../../hooks/useInvoice'

type FactoredInvoiceType = {
  id: string
  icon: EmotionJSX.Element
  name: string
  payer: string
  due: string
  amount: string | number | undefined
  factored: string | number | undefined
  remained: string | number | undefined
}

type Props = {
  creditRecord?: CreditRecordType
  receivableInfo?: ReceivableInfoType
  hasActiveLoan: boolean
  poolName: POOL_NAME
  loading: boolean
  handlePayManually: (id: string) => void
}

const getFactoredInvoceColumns = (
  handlePayManually: (id: string) => void,
): ColumnType<FactoredInvoiceType>[] => [
  {
    title: '',
    dataIndex: 'icon',
    noSeparator: true,
    width: 10,
    style: { padding: '0 0 0 16px' },
  },
  { title: 'Invoices', dataIndex: 'name' },
  { title: 'Payer', dataIndex: 'payer' },
  { title: 'Due', dataIndex: 'due' },
  { title: 'Amount', dataIndex: 'amount' },
  { title: 'Factored', dataIndex: 'factored' },
  { title: 'Remaining', dataIndex: 'remained' },
  {
    title: 'Pay Manually',
    action: (record) => (
      <TableActionButton
        title='Pay Manually'
        handleClick={() => handlePayManually(record.id)}
        className='invoice-factoring-pay-manually-btn'
      />
    ),
  },
]

export function InvoiceFactoredList({
  creditRecord,
  receivableInfo,
  hasActiveLoan,
  poolName,
  loading,
  handlePayManually,
}: Props): React.ReactElement {
  const theme = useTheme()
  const { isActive } = useWeb3React()
  const { decimals } = useRFPoolUnderlyingToken(poolName)
  const [factoredInvoice, setFactoredInvoce] = useState<FactoredInvoiceType>()
  const { getInvoiceInfo } = useInvoice(poolName)
  const { isMdSize } = useMQ()

  useEffect(() => {
    if (creditRecord && receivableInfo?.receivableParam.gt(0) && decimals) {
      const invoiceId = receivableInfo.receivableParam.toString()
      const dueDate = timestampToLL(creditRecord.dueDate.toNumber())
      const { receivableAmount } = receivableInfo
      const { totalDue } = creditRecord
      const factoredInvoce: FactoredInvoiceType = {
        id: invoiceId,
        icon: <ReceiptIcon css={{ width: '18px' }} />,
        name: `Invoice ${getWalletAddressAbbr(invoiceId)}`,
        payer: '',
        due: dueDate,
        amount: formatMoney(downScale(receivableAmount.toNumber(), decimals)),
        factored: formatMoney(downScale(totalDue.toNumber(), decimals)),
        remained: formatMoney(
          downScale(receivableAmount.sub(totalDue).toNumber(), decimals),
        ),
      }
      setFactoredInvoce(factoredInvoce)
    }
  }, [creditRecord, decimals, receivableInfo])

  useEffect(() => {
    const fetchData = async () => {
      if (receivableInfo?.receivableParam.gt(0)) {
        const invoiceInfo = await getInvoiceInfo(receivableInfo.receivableParam)
        if (invoiceInfo) {
          setFactoredInvoce((pre) => {
            if (pre) {
              return {
                ...pre,
                payer: getWalletAddressAbbr(invoiceInfo.payer),
              }
            }
            return undefined
          })
        }
      }
    }
    fetchData()
  }, [getInvoiceInfo, receivableInfo?.receivableParam])

  const getPadding = () => {
    if (isMdSize) {
      return '0 8px 8px 8px'
    }
    return '0 16px 16px 16px'
  }

  const styles = {
    title: css`
      font-family: 'Uni-Neue-Black';
      color: ${theme.palette.text.primary};
      font-size: 24px;
      margin-bottom: 16px;
    `,
    description: css`
      font-family: 'Uni-Neue-Regular';
      color: ${theme.palette.text.primary};
      font-size: 1rem;
    `,
    tableWrapper: css`
      margin-top: 24px;
      padding: ${getPadding()};
      background: linear-gradient(180deg, #ffffff 0%, #ffffff 100%);
      border: 1px solid #ffffff;
      border-radius: 24px;
      position: relative;
    `,
    progress: css`
      width: calc(100% - 30px);
      position: absolute;
      top: 0;
      left: 15px;
    `,
  }

  return (
    <Box>
      <Box css={styles.title}>Factored Invoices</Box>
      <Box css={styles.description} marginBottom='47px'>
        {!isActive && (
          <Box component='span'>
            Please connect wallet to check your factored invoices.
          </Box>
        )}
        {isActive && !hasActiveLoan && (
          <Box component='span'>You don’t have any factored invoices.</Box>
        )}
        {isActive && hasActiveLoan && factoredInvoice && (
          <Box css={styles.tableWrapper}>
            {loading && (
              <Box css={styles.progress}>
                <LinearProgress />
              </Box>
            )}
            <HumaTable
              columns={getFactoredInvoceColumns(handlePayManually)}
              rows={[factoredInvoice]}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
