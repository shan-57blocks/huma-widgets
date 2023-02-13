import { Box, css } from '@mui/material'
import React, { useState } from 'react'
import { Background } from '../../../../components/Background'
import { InvoiceFactoringBorrowWidget } from '../../../../components/widgets/InvoiceFactoring'
import { ChainEnum } from '../../../../utils/chain'

import {
  POOL_NAME,
  POOL_TYPE,
  PoolMap,
  PoolContractMap,
} from '../../../../utils/pool'
import { BorrowCreditLinePool } from './BorrowCreditLinePool'
import { BorrowInvoiceFactoringPool } from './BorrowInvoiceFactoringPool'

export function BorrowPools(): React.ReactElement {
  const creditLinePoolNames = Object.keys(
    PoolMap[POOL_TYPE.CreditLine],
  ) as POOL_NAME[]
  const invoiceFactoringPoolNames = Object.keys(
    PoolMap[POOL_TYPE.Invoice],
  ) as POOL_NAME[]

  const styles = {
    wrapper: css`
      position: relative;
      padding-bottom: 260px;
      max-width: 1307px;
      margin: 0 auto;
    `,
    poolWrapper: css`
      position: relative;
      margin-bottom: 40px;
      z-index: 1;
    `,
  }

  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Box css={styles.wrapper}>
      {creditLinePoolNames.map((creditLinePoolName) => (
        <Box css={styles.poolWrapper} key={creditLinePoolName}>
          <BorrowCreditLinePool
            poolName={creditLinePoolName}
            key={creditLinePoolName}
          />
        </Box>
      ))}
      {invoiceFactoringPoolNames.map((invoiceFactoringPoolName) => (
        <Box css={styles.poolWrapper} key={invoiceFactoringPoolName}>
          <BorrowInvoiceFactoringPool
            poolName={invoiceFactoringPoolName}
            key={invoiceFactoringPoolName}
          />
        </Box>
      ))}
      <Background />
      <InvoiceFactoringBorrowWidget
        tokenId='26337444204170564170797783893924018297742414848733412072645327877464077162747'
        poolInfo={
          PoolContractMap[ChainEnum.Goerli][POOL_TYPE.Invoice][
            POOL_NAME.RequestNetwork
          ]
        }
        isOpen={isOpen}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </Box>
  )
}
