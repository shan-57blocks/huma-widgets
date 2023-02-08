import { EmotionJSX } from '@emotion/react/types/jsx-namespace'
import { Box, Button, css, LinearProgress, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import React, { useCallback, useEffect, useState } from 'react'

import { TableActionButton } from '../../../../components/buttons'
import { HumaTable } from '../../../../components/HumaTable'
import { ReceiptIcon } from '../../../../components/icons'
import { useMQ } from '../../../../hooks/useMQ'
import { useRFPoolUnderlyingToken } from '../../../../hooks/useRFPoolContract'
import { getWalletAddressAbbr } from '../../../../utils/chain'
import { logAction } from '../../../../utils/ddLogger'
import { downScale, formatMoney } from '../../../../utils/number'
import { POOL_NAME } from '../../../../utils/pool'
import { ColumnType } from '../../../../utilTypes'
import { useInvoice } from '../../hooks/useInvoice'

type UpcomingInvoiceType = {
  id: string
  icon: EmotionJSX.Element
  name: string
  payer: string
  due: string
  amount: string | number | undefined
}

type Props = {
  NFTIds?: BigNumber[]
  hasActiveLoan: boolean
  poolName: POOL_NAME
  loading: boolean
  handleGetPaid: (id: string) => void
}

const getUpcomingColumns = (
  userHasActiveLoan: boolean,
  handleGetPaid: (id: string) => void,
): ColumnType<UpcomingInvoiceType>[] => [
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
  {
    title: 'Get Paid',
    action: (record) => (
      <TableActionButton
        title='GET PAID NOW'
        handleClick={() => handleGetPaid(record.id)}
        disabled={userHasActiveLoan}
      />
    ),
  },
]

export function InvoiceUpcomingList({
  NFTIds,
  hasActiveLoan,
  poolName,
  loading,
  handleGetPaid,
}: Props): React.ReactElement {
  const theme = useTheme()
  const { isActive } = useWeb3React()
  const { decimals } = useRFPoolUnderlyingToken(poolName)
  const [invoices, setInvoices] = useState<UpcomingInvoiceType[]>()
  const { getInvoiceInfo } = useInvoice(poolName)
  const { isMdSize, isSmSize } = useMQ()

  useEffect(() => {
    const fetchData = async () => {
      if (NFTIds) {
        const invoiceInfos = await Promise.all(
          NFTIds.map((NFTId) => getInvoiceInfo(NFTId)),
        )
        const result: UpcomingInvoiceType[] = []
        invoiceInfos.forEach((info, index) => {
          if (info) {
            result.push({
              id: NFTIds[index].toString(),
              icon: <ReceiptIcon css={{ width: '18px' }} />,
              name: `Invoice #${index + 1}`,
              payer: getWalletAddressAbbr(info.payer),
              due: '',
              amount: formatMoney(downScale(info.amount, decimals)),
            })
          }
        })
        setInvoices(result)
      }
    }
    fetchData()
  }, [NFTIds, decimals, getInvoiceInfo])

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

  const goToCreateInvoice = useCallback(() => {
    logAction('Go to create invoice')
  }, [])

  return (
    <Box>
      <Box css={styles.title}>Upcoming Invoices</Box>
      <Box css={styles.description} marginBottom='47px'>
        {!isActive && (
          <Box component='span'>
            Please connect wallet to check your upcoming invoices.
          </Box>
        )}
        {isActive && NFTIds && NFTIds.length <= 0 && (
          <Box>
            You don’t have any invoices eligible for factoring. We are adding
            support for more invoice types. For now, you can click the button
            below to create test invoices.
          </Box>
        )}
        {isActive && NFTIds && NFTIds.length > 0 && (
          <Box css={styles.tableWrapper}>
            {loading && (
              <Box css={styles.progress}>
                <LinearProgress />
              </Box>
            )}
            <HumaTable
              columns={getUpcomingColumns(hasActiveLoan, handleGetPaid)}
              rows={invoices}
              hideRowsPerPage={isSmSize}
            />
          </Box>
        )}
        {isActive && (
          <Button
            onClick={goToCreateInvoice}
            type='link'
            size='small'
            variant='contained'
            sx={{ marginTop: '20px' }}
            href='https://huma-requestnetwork-create.netlify.app/'
            target='_blank'
          >
            CREATE INVOICE
          </Button>
        )}
      </Box>
    </Box>
  )
}
