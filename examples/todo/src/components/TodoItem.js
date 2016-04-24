import React, {Component} from 'react'

export default class TodoItem extends Component {

  render() {
    const {value, status} = this.props
    return (
      <li className={status == 'done' ? 'completed': ''}>
        <div className="view">
          <input className="toggle" checked={status == 'done'} type="checkbox" onChange={this.props.onDone}/>
          <label>{value}</label>
          <button className="destroy" onClick={this.props.onDelete}></button>
        </div>
      </li>
    )
  }
}
