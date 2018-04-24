import React, {PureComponent, ChangeEvent, KeyboardEvent} from 'react'
import {ErrorHandling} from 'src/shared/decorators/errors'
import {OnChangeArg} from 'src/types/ifql'

interface Props {
  funcID: string
  argKey: string
  value: string
  type: string
  bodyID: string
  onChangeArg: OnChangeArg
  onGenerateScript: () => void
}

@ErrorHandling
class FuncArgInput extends PureComponent<Props> {
  public render() {
    const {argKey, value, type} = this.props
    return (
      <div>
        <label htmlFor={argKey}>{argKey}: </label>
        <input
          name={argKey}
          value={value}
          placeholder={type}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          type="text"
          className="form-control input-xs"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    )
  }

  private handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return
    }

    e.preventDefault()
    this.props.onGenerateScript()
  }

  private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {funcID, argKey, bodyID} = this.props

    this.props.onChangeArg({
      funcID,
      key: argKey,
      value: e.target.value,
      bodyID,
    })
  }
}

export default FuncArgInput
