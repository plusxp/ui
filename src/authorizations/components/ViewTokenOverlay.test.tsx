// Libraries
import React from 'react'
import {screen} from '@testing-library/react'

// Components
import ViewTokenOverlay from 'src/authorizations/components/ViewTokenOverlay'

// Fixtures
import {auth} from 'mocks/dummyData'
import {permissions} from 'src/utils/permissions'
import {renderWithReduxAndRouter} from 'src/mockState'

const setup = (override?) => {
  const props = {
    auth,
    ...override,
  }

  renderWithReduxAndRouter(<ViewTokenOverlay {...props} />)
}

describe('Account', () => {
  describe('rendering', () => {
    it('renders!', async () => {
      setup()

      const elm = await screen.findByTestId('overlay--container')
      expect(elm).toBeVisible()
    })
  })

  describe('if there is all access tokens', () => {
    it('renders permissions correctly', () => {
      const actual = permissions(auth.permissions)

      const expected = {
        'orgs-a': ['read'],
        authorizations: ['read', 'write'],
        buckets: ['read', 'write'],
        dashboards: ['read', 'write'],
        sources: ['read', 'write'],
        tasks: ['read', 'write'],
        telegrafs: ['read', 'write'],
        users: ['read', 'write'],
        variables: ['read', 'write'],
        scrapers: ['read', 'write'],
        secrets: ['read', 'write'],
        labels: ['read', 'write'],
        views: ['read', 'write'],
        documents: ['read', 'write'],
      }

      expect(actual).toEqual(expected)
    })
  })
})
