import '@testing-library/cypress/add-commands'

import {
  INVOICE_FACTORED_AMOUNT,
  THREE_SECONDS,
  TWENTY_SECONDS,
  TWO_MINUTES,
} from '../utils'

export const invoiceFactoringPayManually = () => {
  const chooseAmountModalIncrementIcon = '.choose-amount-modal-increment-icon'
  const chooseAmountModalPaymentButton = '.choose-amount-modal-action-btn'
  const txDoneModalCloseButton = '.transaction-done-modal-close-btn'

  cy.wait(TWENTY_SECONDS)
  cy.get('body').then((body) => {
    if (body.find('.invoice-factoring-pay-manually-btn').length > 0) {
      cy.get('.invoice-factoring-pay-manually-btn').click()

      // click the increment icon each time will increment 1 usdc
      for (let i = 0; i < INVOICE_FACTORED_AMOUNT; i++) {
        cy.get(chooseAmountModalIncrementIcon, {
          timeout: TWO_MINUTES,
        }).click()
      }

      cy.wait(THREE_SECONDS)
      cy.get(chooseAmountModalPaymentButton).click()

      // wait 2 minutes for transaction to be successful
      cy.get(txDoneModalCloseButton, {
        timeout: TWO_MINUTES,
      }).should('be.visible')

      cy.findAllByText(
        `You have successfully made a payment of ${INVOICE_FACTORED_AMOUNT} USDC.`,
      ).should('exist')
      cy.findAllByText(`The remaining due amount is 0 USDC.`).should('exist')
      cy.contains('You don’t have any factored invoices.', {
        timeout: TWENTY_SECONDS,
      }).should('be.visible')
    }
  })
}

describe('Invoice factoring pay manually', () => {
  beforeEach(() => cy.visit('/#/borrow/invoice?poolName=RequestNetowrk'))

  it(
    'Should pay manually if factored invoice exists',
    invoiceFactoringPayManually,
  )
})
