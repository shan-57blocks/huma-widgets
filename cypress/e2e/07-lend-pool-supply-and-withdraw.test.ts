import '@testing-library/cypress/add-commands'

import { THREE_SECONDS, toNumber, TWO_MINUTES } from '../utils'
import { TEN_SECONDS } from './../utils'

const chooseAmountModalActionButton = '.choose-amount-modal-action-btn'
const txDoneModalCloseButton = '.transaction-done-modal-close-btn'
const creditLinePostion = '#credit-line-pool-position .pool-info-content'
const chooseAmountModalIncrementIcon = '.choose-amount-modal-increment-icon'

describe('Lend pool supply and withdraw', () => {
  beforeEach(() => cy.visit('/#/lend'))

  it('Should supply USDC to credit line pool', () => {
    let positionOld: number = 0
    cy.get(creditLinePostion)
      .invoke('text')
      .then((value) => {
        positionOld = toNumber(value)
      })

    const supplyAmount = 100
    cy.contains('SUPPLY USDC').click()
    cy.get('input[type="number"]').type(String(supplyAmount))
    cy.wait(THREE_SECONDS)
    cy.get(chooseAmountModalActionButton).click()

    // wait 2 minutes for transaction to be successful
    cy.get(txDoneModalCloseButton, {
      timeout: TWO_MINUTES,
    }).should('be.visible')

    cy.findAllByText(
      `You successfully supplied $${supplyAmount}.00 USDC.`,
    ).should('exist')

    cy.get(txDoneModalCloseButton).click()

    cy.wait(TEN_SECONDS)
    cy.get(creditLinePostion)
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(positionOld + supplyAmount)
      })
  })

  it('Should withdraw USDC to credit line pool', () => {
    let positionOld: number = 0
    cy.get(creditLinePostion)
      .invoke('text')
      .then((value) => {
        positionOld = toNumber(value)
      })

    const withdrawAmount = 100
    cy.contains('WITHDRAW').click()
    for (let i = 0; i < withdrawAmount; i++) {
      cy.get(chooseAmountModalIncrementIcon, { timeout: TWO_MINUTES }).click()
    }
    cy.wait(THREE_SECONDS)
    cy.get(chooseAmountModalActionButton).click()

    // wait 2 minutes for transaction to be successful
    cy.get(txDoneModalCloseButton, {
      timeout: TWO_MINUTES,
    }).should('be.visible')

    cy.findAllByText(
      `You successfully withdrawn $${withdrawAmount}.00 USDC.`,
    ).should('exist')

    cy.get(txDoneModalCloseButton).click()

    cy.wait(TEN_SECONDS)
    cy.get(creditLinePostion)
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(positionOld - withdrawAmount)
      })
  })
})
