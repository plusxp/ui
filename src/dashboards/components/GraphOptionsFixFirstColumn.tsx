import React, {SFC} from 'react'

interface Props {
  fixed: boolean
  onToggleFixFirstColumn: () => void
}

const GraphOptionsFixFirstColumn: SFC<Props> = ({
  fixed,
  onToggleFixFirstColumn,
}) => (
  <div
    className="form-group col-xs-12"
    data-testid="graph-options-first-column"
  >
    <div className="form-control-static">
      <input
        type="checkbox"
        id="fixFirstColumnCheckbox"
        data-testid="fix-first-column-checkbox"
        checked={!!fixed}
        onChange={onToggleFixFirstColumn}
      />
      <label htmlFor="fixFirstColumnCheckbox">Lock First Column</label>
    </div>
  </div>
)

export default GraphOptionsFixFirstColumn
