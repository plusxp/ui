// Libraries
import React, {ChangeEvent, FC, useState} from 'react'
import {connect, ConnectedProps} from 'react-redux'
import {get} from 'lodash'

// Utils
import {convertUserInputToNumOrNaN} from 'src/shared/utils/convertUserInput'
import {isFlagEnabled} from 'src/shared/utils/featureFlag'
import {getActiveTimeMachine} from 'src/timeMachine/selectors'

// Components
import {
  ComponentStatus,
  Form,
  Grid,
  Input,
  InputType,
  RangeSlider,
} from '@influxdata/clockface'

// Types
import {AppState} from 'src/types'

// Constants
import {
  LEGEND_OPACITY_DEFAULT,
  LEGEND_OPACITY_MAXIMUM,
  LEGEND_OPACITY_MINIMUM,
  LEGEND_OPACITY_STEP,
  LEGEND_COLORIZATION_ROWS_DEFAULT,
} from 'src/shared/constants'

interface OwnProps {
  onLegendOpacityChange: (opacity: number) => void
  onLegendOrientationThresholdChange: (threshold: number) => void
}

type ReduxProps = ConnectedProps<typeof connector>
type Props = OwnProps & ReduxProps

const LegendOrientation: FC<Props> = props => {
  const {
    legendOpacity,
    onLegendOpacityChange,
    legendOrientationThreshold,
    onLegendOrientationThresholdChange,
  } = props

  const [thresholdInputStatus, setThresholdInputStatus] = useState(
    ComponentStatus.Default
  )
  const [thresholdInput, setThresholdInput] = useState(
    legendOrientationThreshold
  )

  if (!isFlagEnabled('legendOrientation')) {
    return null
  }

  const handleSetThreshold = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = convertUserInputToNumOrNaN(event)

    setThresholdInput(value)
    if (isNaN(value)) {
      setThresholdInputStatus(ComponentStatus.Error)
    } else {
      setThresholdInputStatus(ComponentStatus.Default)
      onLegendOrientationThresholdChange(value)
    }
  }

  const handleSetOpacity = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = convertUserInputToNumOrNaN(event)

    if (isNaN(value) || value < LEGEND_OPACITY_MINIMUM) {
      onLegendOpacityChange(LEGEND_OPACITY_MAXIMUM)
    } else {
      onLegendOpacityChange(value)
    }
  }

  return (
    <Grid.Column>
      <h5 className="view-options--header">Legend</h5>
      <Form.Element
        label="Rotation Threshold"
        helpText="Legends with column count exceeding this threshold appear vertically instead of horizontally"
      >
        <Input
          name="legend-columns"
          onChange={handleSetThreshold}
          onFocus={handleSetThreshold}
          placeholder="Enter a number"
          status={thresholdInputStatus}
          type={InputType.Number}
          value={thresholdInput}
        />
      </Form.Element>
      <Form.Element label={`Opacity: ${legendOpacity.toFixed(2)}`}>
        <RangeSlider
          max={LEGEND_OPACITY_MAXIMUM}
          min={LEGEND_OPACITY_MINIMUM}
          step={LEGEND_OPACITY_STEP}
          value={legendOpacity}
          onChange={handleSetOpacity}
        />
      </Form.Element>
    </Grid.Column>
  )
}

//map state to props
const mstp = (state: AppState) => {
  const timeMachine = getActiveTimeMachine(state)
  const legendOrientationThreshold: number = get(
    timeMachine,
    'view.properties.legendOrientationThreshold',
    undefined
  )
  const legendOpacity: number = get(
    timeMachine,
    'view.properties.legendOpacity',
    LEGEND_OPACITY_DEFAULT
  )

  const legendColorizationRows: boolean = get(
      timeMachine,
      'view.properties.legendColorizationRows',
      LEGEND_COLORIZATION_ROWS_DEFAULT
  )

  // todo:  if a feature flag is enabled, add legendColorizationRows to the return; else exclude it
  // (put above declaration in the clause too)
  // let result = {legendOpacity, legendOrientationThreshold}
  // result = {...result, legendColorizationRows}
  // return result

  return {legendOpacity, legendOrientationThreshold, legendColorizationRows}
}

const connector = connect(mstp)
export default connector(LegendOrientation)
