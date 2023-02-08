import { Box, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'
import { ApolloWrapper } from '../../../../components/ApolloWrapper'

import { useNFTIds } from '../../../../hooks/useInvoiceNFTContract'
import { useMQ } from '../../../../hooks/useMQ'
import { usePoolInfo, usePoolName } from '../../../../hooks/usePool'
import { useRefresh } from '../../../../hooks/useRefresh'
import { useReceivableStats } from '../../../../hooks/useRFPoolContract'
import { CreditEvent, hasRFActiveLoan } from '../../../../utils/credit'
import { POOL_TYPE, PoolMap } from '../../../../utils/pool'
import { InvoiceFactoringSDK } from '../../../sdk/InvoiceFactoring/components/InvoiceFactoringSDK'
import { Activity } from '../Activity'
import { InvoiceFactoredList } from './InvoiceFactoredList'
import { InvoiceUpcomingList } from './InvoiceUpcomingList'

export function InvoceFactoring(): React.ReactElement {
  const theme = useTheme()
  const poolName = usePoolName()
  const { account } = useWeb3React()
  const [{ creditRecord, receivableInfo }, refreshReceivableStats] =
    useReceivableStats(poolName, account)
  const accountHasActiveLoan = hasRFActiveLoan(creditRecord, receivableInfo)
  const [NFTIds, refreshNFTIds] = useNFTIds(poolName, account)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedNFTId, setSelectedNFTId] = useState<string>()
  const poolInfo = usePoolInfo(poolName, POOL_TYPE.Invoice)
  const [actionType, setActionType] = useState<'borrow' | 'payment'>()
  const [subscribe, loading] = useRefresh()
  const { isMdSize, isXsSize } = useMQ()

  const getPadding = () => {
    if (isXsSize) {
      return '0 8px 8px 8px'
    }
    if (isMdSize) {
      return '0 32px 32px 32px'
    }
    return '0 90px 90px 90px'
  }

  const styles = {
    wrapper: css`
      max-width: 1307px;
      padding: ${getPadding()};
      margin: 0 auto;
    `,
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
  }

  const handleGetPaid = useCallback((nftId: string) => {
    setModalIsOpen(true)
    setSelectedNFTId(nftId)
    setActionType('borrow')
  }, [])

  const handleGetPaidSuccess = useCallback(
    (blockNumber: number) => {
      const callbackFn = () => {
        refreshReceivableStats()
        refreshNFTIds()
      }
      subscribe(blockNumber, callbackFn)
    },
    [refreshNFTIds, refreshReceivableStats, subscribe],
  )

  const handlePayManually = useCallback((nftId: string) => {
    setModalIsOpen(true)
    setSelectedNFTId(nftId)
    setActionType('payment')
  }, [])

  const handleClose = () => {
    setActionType(undefined)
    setModalIsOpen(false)
  }

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.title}>Invoice Factoring</Box>
      <Box css={styles.description} marginBottom='47px'>
        {PoolMap.Invoice[poolName].borrowDesc}
      </Box>
      <InvoiceFactoredList
        creditRecord={creditRecord}
        receivableInfo={receivableInfo}
        poolName={poolName}
        hasActiveLoan={accountHasActiveLoan}
        handlePayManually={handlePayManually}
        loading={loading && actionType === 'payment'}
      />
      <InvoiceUpcomingList
        NFTIds={NFTIds}
        poolName={poolName}
        handleGetPaid={handleGetPaid}
        hasActiveLoan={accountHasActiveLoan}
        loading={loading && actionType === 'borrow'}
      />
      <ApolloWrapper>
        {poolInfo && (
          <Activity
            poolInfo={poolInfo}
            targetEvents={[
              CreditEvent.DrawdownMadeWithReceivable,
              CreditEvent.PaymentMade,
              CreditEvent.ReceivedPaymentProcessed,
            ]}
          />
        )}
      </ApolloWrapper>
      {creditRecord &&
        receivableInfo &&
        selectedNFTId &&
        poolInfo &&
        actionType && (
          <InvoiceFactoringSDK
            creditRecord={creditRecord}
            receivableInfo={receivableInfo}
            poolInfo={poolInfo}
            isOpen={modalIsOpen}
            tokenId={selectedNFTId}
            handleClose={handleClose}
            handleSuccess={handleGetPaidSuccess}
            actionType={actionType}
          />
        )}
    </Box>
  )
}
