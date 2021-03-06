// Libraries
import React, {FC} from 'react'

// Components
import {SquareButton, IconFont} from '@influxdata/clockface'

// Utils
import {event} from 'src/cloud/utils/reporting'

interface Props {
  onRemove?: () => void
}

const RemoveButton: FC<Props> = ({onRemove}) => {
  if (!onRemove) {
    return null
  }

  const handleClick = (): void => {
    event('notebook_delete_cell')

    onRemove()
  }

  return (
    <SquareButton
      className="flows-delete-cell"
      testID="flows-delete-cell"
      icon={IconFont.Remove}
      onClick={handleClick}
      titleText="Remove this cell"
    />
  )
}

export default RemoveButton
