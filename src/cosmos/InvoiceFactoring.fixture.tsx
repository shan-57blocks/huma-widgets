/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Eip1193Bridge } from '@ethersproject/experimental'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ethers, Wallet } from 'ethers'
import { deepCopy } from 'ethers/lib/utils'
import React, { useState } from 'react'

import { InvoiceFactoringBorrowWidget } from '../components/widgets/InvoiceFactoring'
import { ChainEnum } from '../utils/chain'
import { POOL_NAME, POOL_TYPE, PoolContractMap } from '../utils/pool'

const TEST_PRIVATE_KEY =
  '408e2ff555386c5a1571fbcd44933959e6b857866d78024f1966fe5008613377'
const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address
const provider = new JsonRpcProvider(
  'https://goerli.infura.io/v3/a3629013e1684648881ceae2383e9928',
  {
    name: 'Goerli',
    chainId: 5,
  },
)
const signer = new Wallet(TEST_PRIVATE_KEY, provider)

export const injected = new (class extends Eip1193Bridge {
  chainId = 5

  async sendAsync(...args: any[]) {
    console.debug('sendAsync called', ...args)
    return this.send(...args)
  }

  async send(...args: any[]) {
    console.debug('send called', ...args)
    const isCallbackForm =
      typeof args[0] === 'object' && typeof args[1] === 'function'
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      method = args[0].method
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        callback({ result: [TEST_ADDRESS_NEVER_USE] })
      } else {
        return Promise.resolve([TEST_ADDRESS_NEVER_USE])
      }
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        callback(null, { result: '0x5' })
      } else {
        return Promise.resolve('0x5')
      }
    }
    // Eip1193Bridge only supports eth_sign
    // address is the first param for eth_sign
    if (method === 'personal_sign') {
      method = 'eth_sign'
      const [data, address] = deepCopy(params)
      params[0] = address
      params[1] = data
    }
    try {
      // Please refer to: https://github.com/ethers-io/ethers.js/issues/1683
      // If from is present on eth_call it errors, removing it makes the library set
      // from as the connected wallet which works fine
      if (params && params.length && method === 'eth_call') {
        if (params[0].from) {
          delete params[0].from
        }
        if (params[0].gas) {
          delete params[0].gas
        }
      }

      let result
      // For sending a transaction if we call send it will error
      // as it wants gasLimit in sendTransaction but hexlify sets the property gas
      // to gasLimit which makes sensd transaction error.
      // This have taken the code from the super method for sendTransaction and altered
      // it slightly to make it work with the gas limit issues.
      if (
        params &&
        params.length &&
        params[0].from &&
        method === 'eth_sendTransaction'
      ) {
        // Hexlify will not take gas, must be gasLimit, set this property to be gasLimit
        params[0].gasLimit = params[0].gas
        delete params[0].gas
        // If from is present on eth_sendTransaction it errors, removing it makes the library set
        // from as the connected wallet which works fine
        delete params[0].from
        const req = ethers.providers.JsonRpcProvider.hexlifyTransaction(
          params[0],
        )
        // Hexlify sets the gasLimit property to be gas again and send transaction requires gasLimit
        req.gasLimit = req.gas
        delete req.gas
        // Send the transaction
        const tx = await this.signer.sendTransaction(req)
        result = tx.hash
      } else {
        // All other transactions the base class works for
        result = await super.send(method, params)
      }
      console.debug('result received', method, params, result)
      if (isCallbackForm) {
        callback(null, { result })
      } else {
        return result
      }
    } catch (error) {
      console.log(error)
      if (isCallbackForm) {
        callback(error, null)
      } else {
        throw error
      }
    }
  }
})(signer, provider)

function Fixture() {
  // @ts-ignore
  window.ethereum = injected
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
