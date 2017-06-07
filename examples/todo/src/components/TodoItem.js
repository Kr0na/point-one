import React, {Component} from 'react'

export default class TodoItem extends Component {

  constructor(...opts) {
    super(...opts)
    this.state = {
      editMode: false
    }
  }

  render() {
    const {value, status} = this.props
    return (
      <li className={`${status == 'done' ? 'completed': ''} ${this.state.editMode ? 'editing': '' }`}>
        <div className="view">
          <input className="toggle" checked={status == 'done'} type="checkbox" onChange={this.props.onDone}/>
          {this.state.editMode ? null
            : <label onDoubleClick={e => this.setState({editMode: true})}>{value}</label>
          }
          <button className="destroy" onClick={this.props.onDelete}></button>
        </div>
        <input type="text" defaultValue={this.props.value} onBlur={e => this.props.onUpdate(e.target.value) && this.setState({editMode: false})} className="edit" />
      </li>
    )
  }
}
