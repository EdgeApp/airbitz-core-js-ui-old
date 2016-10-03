import React from 'react'

var AbcUiDropDown = React.createClass({
  render () {
    var block = null
    var that = this
    var contentList = this.props.contentList
    var toggleInput = null
    var selectElement = (
      <select ref="selectedItem"
        className="form-control"
        onChange={this.handleSelection}
        defaultValue={this.props.selectedItem}>
        {contentList.map(function (content) {
          return (<option value={content} key={content}>{content}</option>)
        })}
      </select>
    )
    return selectElement
  },
  handleSelection () {
    if (this.props.onUserChange) {
      this.props.onUserChange(this.refs.selectedItem.value)
    }
  },
  getValue () {
    return this.refs.selectedItem.value
  }
})

module.exports = AbcUiDropDown

