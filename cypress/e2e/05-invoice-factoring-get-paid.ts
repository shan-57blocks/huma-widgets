import '@testing-library/cypress/add-commands'

import {
  formatMoney,
  getWalletAddressAbbr,
  INVOICE_AMOUNT,
  INVOICE_FACTORED_AMOUNT,
  INVOICE_FEES,
  ONE_MINUTE,
  TEST_ADDRESS_NEVER_USE,
  TWO_MINUTES,
} from '../utils'
import { invoiceFactoringPayManually } from './06-invoice-factoring-pay-manually'

describe('Invoice factoring get paid', () => {
  beforeEach(() => cy.visit('/#/borrow/invoice?poolName=RequestNetowrk'))

  it(
    'Should pay manually if factored invoice exists',
    invoiceFactoringPayManually,
  )

  it('Should get paid 80 USDC for an invoice factoring of 100 USDC value', () => {
    const receivedUSDC = INVOICE_FACTORED_AMOUNT - INVOICE_FEES
    const remainedUSDC = INVOICE_AMOUNT - INVOICE_FACTORED_AMOUNT
    const chooseAmountModalIncrementIcon = '.choose-amount-modal-increment-icon'
    const txDoneModalCloseButton = '.transaction-done-modal-close-btn'

    cy.get('button').contains('GET PAID NOW', { timeout: ONE_MINUTE }).click()

    // click the increment icon each time will increment 1 usdc
    for (let i = 0; i < INVOICE_FACTORED_AMOUNT; i++) {
      cy.get(chooseAmountModalIncrementIcon, { timeout: TWO_MINUTES }).click()
    }

    cy.get('button').contains('ACCEPT TERMS').click()
    cy.findAllByText(`${receivedUSDC} USDC`).should('exist')
    cy.get('button').contains('Approve NFT').click()

    // wait 2 minutes for transaction to be successful
    cy.get(txDoneModalCloseButton, {
      timeout: TWO_MINUTES,
    }).should('be.visible')

    cy.findAllByText(`${receivedUSDC} USDC is now in your wallet.`).should(
      'exist',
    )
    cy.findAllByText(
      `The remaining ${remainedUSDC} USDC will be sent to your wallet when the invoice is paid.`,
    ).should('exist')

    cy.get(txDoneModalCloseButton).click()

    cy.get('table')
      .contains(getWalletAddressAbbr(TEST_ADDRESS_NEVER_USE))
      .should('exist')
    cy.get('table')
      .contains(String(formatMoney(INVOICE_AMOUNT)))
      .should('exist')
    cy.get('table')
      .contains(String(formatMoney(INVOICE_FACTORED_AMOUNT)))
      .should('exist')
    cy.get('table')
      .contains(String(formatMoney(remainedUSDC)))
      .should('exist')
  })
})
