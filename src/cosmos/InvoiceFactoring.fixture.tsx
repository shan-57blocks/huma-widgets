import React, { useState } from 'react'
import { InvoiceFactoringBorrowWidget } from '../components/widgets/InvoiceFactoring/Borrow'
import { ChainEnum } from '../utils/chain'
import { PoolContractMap, POOL_NAME, POOL_TYPE } from '../utils/pool'

function Fixture() {
  const poolInfo =
    PoolContractMap[ChainEnum.Goerli][POOL_TYPE.Invoice][
      POOL_NAME.RequestNetwork
    ]
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSuccess = () => {
    setIsOpen(false)
  }

  const tokenId =
    '26337444204170564170797783893924018297742414848733412072645327877464077162747'

  return (
    <InvoiceFactoringBorrowWidget
      tokenId={tokenId}
      poolInfo={poolInfo}
      isOpen={isOpen}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    />
  )
}

export default <Fixture />
