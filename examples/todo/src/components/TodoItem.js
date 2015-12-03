import React, {Component} from 'react'

export default class TodoItem extends Component {

  render() {
    const {value} = this.props
    return (
      <div className="row">
        <div className="col-xs-8">
          {value}
        </div>
        <div className="col-xs-2">
          <button className="btn btn-xs" onClick={this.props.onDone}>Done</button>
        </div>
        <div className="col-xs-2">
          <button className="btn btn-xs" onClick={this.props.onDelete}>Delete</button>
        </div>
      </div>
    )
  }
}
