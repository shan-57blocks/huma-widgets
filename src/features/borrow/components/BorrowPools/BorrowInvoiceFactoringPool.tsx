import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { PoolInfo } from '../../../../components/layout/PoolInfo'
import { useMQ } from '../../../../hooks/useMQ'
import {
  useRFPoolBalance,
  useRFPoolUnderlyingToken,
} from '../../../../hooks/useRFPoolContract'
import { routes } from '../../../../Router'
import { isEmpty } from '../../../../utils/common'
import { logAction } from '../../../../utils/ddLogger'
import { downScale, formatMoney } from '../../../../utils/number'
import { POOL_NAME, PoolMap } from '../../../../utils/pool'
import { ConnectWalletButton } from '../../../wallet/components'

type Props = {
  poolName: POOL_NAME
}

export function BorrowInvoiceFactoringPool({
  poolName,
}: Props): React.ReactElement {
  const { isActive } = useWeb3React()
  const { decimals } = useRFPoolUnderlyingToken(poolName)
  const [invoiceFactoringPoolBalance] = useRFPoolBalance(poolName)
  const { isXsSize } = useMQ()

  const items = useMemo(() => {
    const poolBalanceItem = {
      id: 'invoice-factoring-pool-balance',
      title: 'Liquidity',
      value:
        isActive && !isEmpty(invoiceFactoringPoolBalance)
          ? formatMoney(downScale(invoiceFactoringPoolBalance!, decimals))
          : '--',
      isLoading: isActive && isEmpty(invoiceFactoringPoolBalance),
    }
    return [poolBalanceItem]
  }, [decimals, invoiceFactoringPoolBalance, isActive])

  const checkInvoices = useCallback(() => {
    logAction('Check invoices')
  }, [])

  const buttons = useMemo(() => {
    if (!isActive) {
      return [
        <ConnectWalletButton text='CONNECT YOUR WALLET' variant='contained' />,
      ]
    }
    return [
      <Button
        onClick={checkInvoices}
        variant='contained'
        component={Link}
        to={`${routes.borrowInvoice.path}?poolName=${poolName}`}
      >
        SEE YOUR INVOICES
      </Button>,
    ]
  }, [checkInvoices, isActive, poolName])

  return (
    <PoolInfo
      id='invoice-factoring-pool-borrow'
      title='Invoice Factoring'
      description={PoolMap.Invoice[poolName].borrowDesc}
      items={items}
      buttons={buttons}
      buttonWidth={255}
      infoOneRow={!isXsSize}
    />
  )
}
