import {
  FIVE_SECONDS,
  ONE_MINUTE,
  TEN_SECONDS,
  THREE_SECONDS,
  toNumber,
  TWO_MINUTES,
} from '../utils'

const availableCreditElement = '#credit-line-available-credit'
const currentBalanceElement = '#credit-line-current-balance'
const borrowButtn = '#credit-line-borrow-btn'
const chooseAmountModalIncrementIcon = '.choose-amount-modal-increment-icon'
const chooseAmountModalBorrowButton = '.choose-amount-modal-action-btn'
const txDoneModalCloseButton = '.transaction-done-modal-close-btn'
const payButtn = '#credit-line-pay-btn'
const chooseAmountModalSelectPayoffButton =
  '.choose-amount-modal-select-payoff-btn'
const chooseAmountModalPayoffButton = '.choose-amount-modal-action-btn'

describe('Credit Line Borrow', () => {
  beforeEach(() => cy.visit('/#/borrow/credit-line?poolName=HumaCreditLine'))

  it('Should borrow 5 USDC from credit line pool', () => {
    const borrowedUsdc = 5

    cy.get(borrowButtn, {
      timeout: TEN_SECONDS,
    }).should('be.visible')

    let availableCreditOld: number = 0
    let currentBalanceOld: number = 0

    cy.get(availableCreditElement)
      .invoke('text')
      .then((value) => {
        availableCreditOld = toNumber(value)
      })

    cy.get(currentBalanceElement)
      .invoke('text')
      .then((value) => {
        currentBalanceOld = toNumber(value)
      })

    cy.get(borrowButtn).click()
    // click the increment icon each time will increment 1 usdc
    for (let i = 0; i < 5; i++) {
      cy.get(chooseAmountModalIncrementIcon).click()
    }
    cy.wait(THREE_SECONDS)
    cy.get(chooseAmountModalBorrowButton).click()

    // wait 2 minutes for transaction to be successful
    cy.get(txDoneModalCloseButton, {
      timeout: TWO_MINUTES,
    })
      .should('be.visible')
      .click()

    cy.get(availableCreditElement, {
      timeout: ONE_MINUTE,
    })
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(availableCreditOld - borrowedUsdc)
      })

    cy.get(currentBalanceElement, {
      timeout: ONE_MINUTE,
    })
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(currentBalanceOld + borrowedUsdc)
      })
  })

  it('Should pay off for credit line pool', () => {
    cy.wait(FIVE_SECONDS)

    cy.get(payButtn, {
      timeout: TEN_SECONDS,
    }).should('be.visible')

    cy.get(payButtn).click()
    cy.get(chooseAmountModalSelectPayoffButton).click()
    cy.wait(THREE_SECONDS)
    cy.get(chooseAmountModalPayoffButton).click()

    // wait 2 minutes for transaction to be successful
    cy.get(txDoneModalCloseButton, {
      timeout: TWO_MINUTES,
    })
      .should('be.visible')
      .click()

    cy.get(availableCreditElement, {
      timeout: ONE_MINUTE,
    })
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(1000)
      })

    cy.get(currentBalanceElement, {
      timeout: ONE_MINUTE,
    })
      .invoke('text')
      .should((value) => {
        expect(toNumber(value)).equal(0)
      })
  })
})
