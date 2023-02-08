import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useMemo, useState } from 'react'

import { PoolInfo } from '../../../../components/layout/PoolInfo'
import { useMQ } from '../../../../hooks/useMQ'
import { usePoolInfo } from '../../../../hooks/usePool'
import { useRefresh } from '../../../../hooks/useRefresh'
import {
  useRFLenderApproved,
  useRFLenderPosition,
  useRFPoolBalance,
  useRFPoolUnderlyingToken,
} from '../../../../hooks/useRFPoolContract'
import { isEmpty } from '../../../../utils/common'
import { downScale, formatMoney } from '../../../../utils/number'
import { POOL_NAME, POOL_TYPE, PoolMap } from '../../../../utils/pool'
import { LendSDK } from '../../../sdk/Lend/components/LendSDK'
import { ConnectWalletButton } from '../../../wallet/components'

type Props = {
  poolName: POOL_NAME
}

export function LendInvoiceFactoringPool({
  poolName,
}: Props): React.ReactElement {
  const { isLgSize, isSmSize } = useMQ()
  const { isActive, account } = useWeb3React()
  const poolInfo = usePoolInfo(poolName, POOL_TYPE.Invoice)
  const { decimals } = useRFPoolUnderlyingToken(poolName)
  const [poolBalance, refreshPoolBalance] = useRFPoolBalance(poolName)
  const [lenderPosition, refreshLenderPosition] = useRFLenderPosition(
    poolName,
    account,
  )
  const [lenderApproved, refreshLenderApproved] = useRFLenderApproved(
    poolName,
    account,
  )
  const [actionType, setActionType] = useState<'supply' | 'withdraw'>()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [subscribe, loading] = useRefresh()

  const buttonWith = useMemo(() => {
    if (!isActive) {
      return 205
    }
    return isLgSize ? 180 : 132
  }, [isActive, isLgSize])

  const items = useMemo(() => {
    const poolBalanceItem = {
      id: 'invoice-factoring-pool-balance',
      title: 'Total pool balance',
      value:
        isActive && !isEmpty(poolBalance)
          ? formatMoney(downScale(poolBalance!, decimals))
          : '--',
      isLoading: (isActive && isEmpty(poolBalance)) || loading,
    }
    const estApyItem = {
      id: 'invoice-factoring-pool-apy',
      title: 'Est APY',
      value: '10-20%',
      isLoading: false,
    }
    const positionItem = {
      id: 'invoice-factoring-pool-position',
      title: 'Your Position',
      value:
        isActive && !isEmpty(lenderPosition)
          ? formatMoney(downScale(lenderPosition!, decimals))
          : '--',
      isLoading: (isActive && isEmpty(lenderPosition)) || loading,
    }
    return [poolBalanceItem, estApyItem, positionItem]
  }, [isActive, poolBalance, decimals, loading, lenderPosition])

  const handleSupply = () => {
    setModalIsOpen(true)
    setActionType('supply')
  }

  const handleWithDraw = () => {
    setModalIsOpen(true)
    setActionType('withdraw')
  }

  const buttons = useMemo(() => {
    if (!isActive) {
      return [
        <ConnectWalletButton text='CONNECT YOUR WALLET' variant='contained' />,
      ]
    }
    return [
      <Button
        variant='outlined'
        onClick={handleWithDraw}
        disabled={lenderPosition?.lte(0)}
      >
        WITHDRAW
      </Button>,
      <Button variant='contained' onClick={handleSupply}>
        SUPPLY {poolInfo?.poolUnderlyingToken.symbol}
      </Button>,
    ]
  }, [isActive, lenderPosition, poolInfo?.poolUnderlyingToken.symbol])

  const handleClose = () => {
    setModalIsOpen(false)
    setActionType(undefined)
  }

  const handleApproveSuccess = useCallback(() => {
    refreshLenderApproved()
  }, [refreshLenderApproved])

  const handleSuccess = useCallback(
    (blockNumber: number) => {
      const callbackFn = () => {
        refreshPoolBalance()
        refreshLenderPosition()
      }
      subscribe(blockNumber, callbackFn)
    },
    [refreshLenderPosition, refreshPoolBalance, subscribe],
  )

  return (
    <>
      <PoolInfo
        id='invoice-factoring-pool-lend'
        title='Invoice Factoring'
        description={PoolMap.Invoice[poolName].lendDesc}
        items={items}
        buttons={buttons}
        buttonWidth={buttonWith}
        infoOneRow={!isSmSize}
      />
      {poolInfo && actionType && !isEmpty(lenderApproved) && (
        <LendSDK
          lenderPosition={lenderPosition}
          lenderApproved={lenderApproved!}
          poolInfo={poolInfo}
          isOpen={modalIsOpen}
          handleClose={handleClose}
          handleApprove={handleApproveSuccess}
          handleSuccess={handleSuccess}
          actionType={actionType}
        />
      )}
    </>
  )
}
