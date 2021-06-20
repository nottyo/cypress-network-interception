import locators from '../support/locators'
import network from '../support/network'

describe('Users', () => {

  it('should display users with network synchronization', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher)
      .as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    cy.wait(`@${network.users.getUsers.alias}`)
    // then
    cy.findAllByTestId(locators.users.email)
      .first().should('have.text', 'george.bluth@reqres.in')
  })

  it('should send request with page and delay queries', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher)
      .as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    // cy.wait(`@${network.users.getUsers.alias}`)
    //   .then(({ request }) => {
    //     expect(request.method).to.equal('GET')
    //     expect(request.url).to.contains('?page=1')
    //   })
    // shorthand version
    cy.wait(`@${network.users.getUsers.alias}`)
      .its('request.url')
      .should('contain', '?page=1')
  })

  it('should be able to modify request by cypress', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, (req) => {
     req.headers['x-cypress'] = 'added by cypress'
    }).as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    // then
    cy.wait(`@${network.users.getUsers.alias}`)
      .its('request.headers')
      .should('have.a.property', 'x-cypress', 'added by cypress')
  })

  it('should be able to stub all response', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, {
      statusCode: 200,
      fixture: 'users.json'
    }).as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    // then
    cy.findAllByTestId(locators.users.email)
      .first().should('have.text', 'nottyo@test.com')
  })

  it('should be able to stub some of response', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, (req) => {
      req.on('before:response', (res) => {
        res.body.data[0] = {
          "id": 1,
          "email": "nottyo@test.com",
          "first_name": "Traitanit",
          "last_name": "Huangsri",
          "avatar": "https://avatars.githubusercontent.com/u/8110002?s=120"
        }
      })
    }).as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    cy.wait(`@${network.users.getUsers.alias}`)
    // then
    cy.findAllByTestId(locators.users.email)
      .first().should('have.text', 'nottyo@test.com')
  })

  it('should be able to throttle response message', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, (req) => {
      req.on('response', (res) => {
        res.setThrottle(128)
      })
    }).as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    cy.wait(`@${network.users.getUsers.alias}`)
    // then
    cy.findAllByTestId(locators.users.email)
      .first().should('have.text', 'george.bluth@reqres.in')
  })

  it('should be able to delay response message', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, (req) => {
      req.on('response', (res) => {
        res.setDelay(10000)
      })
    }).as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    cy.wait(`@${network.users.getUsers.alias}`)
    // then
    cy.findAllByTestId(locators.users.email)
      .first().should('have.text', 'george.bluth@reqres.in')
  })

  it('should send a corrent page query when changing page', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher)
      .as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    cy.wait(`@${network.users.getUsers.alias}`)
    cy.findByTestId(locators.users.pagination.page2).click()
    // then
    cy.wait(`@${network.users.getUsers.alias}`)
      .its('request.url')
      .should('contain', '?page=2')
  })

  it('simulate network errors', () => {
    // given
    cy.intercept(network.users.getUsers.routeMatcher, { forceNetworkError: true })
      .as(network.users.getUsers.alias)
    // when
    cy.visit(Cypress.config('baseUrl'))
    // then
    cy.findByText('Network Error').should('be.visible')
  })
})