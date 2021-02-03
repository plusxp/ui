// Libraries
import React from 'react'
import {screen} from '@testing-library/react'
import {renderWithReduxAndRouter} from 'src/mockState'

// Components
import FetchAuthToken from 'src/dataLoaders/components/verifyStep/FetchAuthToken'

jest.mock('src/utils/api', () => require('src/onboarding/apis/mocks'))

const setup = (override = {}) => {
  const props = {
    bucket: '',
    username: '',
    children: jest.fn(),
    ...override,
  }

  renderWithReduxAndRouter(<FetchAuthToken {...props} />)
}

describe('FetchAuthToken', () => {
  it('renders', async () => {
    setup()
    const elm = await screen.getByTestId('spinner-container')
    expect(elm).toBeVisible()
  })
})
