import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

export const THREE_SECONDS = 3 * 1000
export const FIVE_SECONDS = 5 * 1000
export const TEN_SECONDS = 10 * 1000
export const TWENTY_SECONDS = 20 * 1000
export const ONE_MINUTE = 60 * 1000
export const TWO_MINUTES = 120 * 1000
export const INVOICE_AMOUNT = 100
export const INVOICE_FACTORED_AMOUNT = 80
export const INVOICE_FEES = 8

export const chooseAmountModalIncrementIcon =
  '.choose-amount-modal-increment-icon'
export const txDoneModalCloseButton = '.transaction-done-modal-close-btn'

export const TEST_PRIVATE_KEY = Cypress.env('E2E_TEST_PRIVATE_KEY')

export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address

export const provider = new JsonRpcProvider(
  Cypress.env('E2E_TEST_INFURA_GOERLI'),
  {
    name: 'Goerli',
    chainId: 5,
  },
)

export const signer = new Wallet(TEST_PRIVATE_KEY, provider)

export const toNumber = (text: string) => {
  return Number(text.replace('$', '').replace(',', '').replace('%', ''))
}

export const getTestSelector = (selectorId: string) =>
  `[data-testid=${selectorId}]`

const valueCheck = (
  element: string,
  formula: 'be.gt' | 'be.gte',
  base: number,
) => {
  cy.get(element, {
    timeout: ONE_MINUTE,
  })
    .should('be.visible')
    .each(($el) => {
      cy.wait(THREE_SECONDS)
      const value = $el[0].innerText
        .replace('$', '')
        .replace(',', '')
        .replace('%', '')
      cy.wrap(Number(value)).should(formula, base)
    })
}

export const valueGreaterThanZero = (element: string) => {
  valueCheck(element, 'be.gt', 0)
}

export const valueGreaterThanEqualToZero = (element: string) => {
  valueCheck(element, 'be.gte', 0)
}

export const getWalletAddressAbbr = (address: string) => {
  if (!address) {
    return address
  }
  const { length } = address
  return `${address.slice(0, 6)}...${address.slice(length - 4, length)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (value: undefined | null | any) =>
  value === undefined || value === null

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatMoney = (num: number | string | undefined) => {
  if (isEmpty(num) || Number.isNaN(num)) {
    return num
  }
  return formatter.format(Number(num))
}
