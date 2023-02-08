import '@testing-library/cypress/add-commands'
import {
  INVOICE_AMOUNT,
  ONE_MINUTE,
  TEST_ADDRESS_NEVER_USE,
  TWO_MINUTES,
} from '../utils'

describe('Create RN request', () => {
  beforeEach(() => cy.visit(Cypress.env('E2E_TEST_RN_CREATE_BASE_URL')))

  it('Create RN request', () => {
    cy.findByText('Metamask', { timeout: ONE_MINUTE }).click()
    cy.get('input[name="amount"]').type(String(INVOICE_AMOUNT))
    cy.get('input[name="payer"]').type(TEST_ADDRESS_NEVER_USE)
    cy.get('button').contains('Create a request').click()
    cy.findAllByText('Request for payment from', {
      timeout: TWO_MINUTES,
    }).should('exist')
  })
})
