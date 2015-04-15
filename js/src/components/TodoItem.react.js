var React = require('react/lib/ReactWithAddons');
var TodoStore = require('../stores/TodoStore');
var TodoActions = require('../actions/TodoActions');
var assign = require('object-assign');
var classSet = React.addons.classSet;

'use strict';

var TodoItem = React.createClass({

  getInitialState: function () {
    return {
      isBeingEdited: false
    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if(this.state.isBeingEdited) {
      var titleInput = React.findDOMNode(this.refs.titleInput);
      var staticTitle = React.findDOMNode(this.refs.staticTitle);
      var $titleInput = $(titleInput);
      var $staticTitle = $(staticTitle);

      //Set the height of the input (height including padding) to be the same
      //as the height of the div containing the text (including margin + padding)
      var staticTextElementHeight = $staticTitle.outerHeight(true);
      var editableTextElementHeightWithPadding = $titleInput.outerHeight();
      var editableTextElementHeightWithoutPadding = $titleInput.height();
      var editableTextElementPaddingHeight =
        editableTextElementHeightWithPadding - editableTextElementHeightWithoutPadding;
      var heightDifference = staticTextElementHeight - editableTextElementHeightWithPadding;
      $titleInput.height(
        (editableTextElementHeightWithPadding + heightDifference)
          - editableTextElementPaddingHeight
      );

      titleInput.focus();
      titleInput.selectionStart = titleInput.selectionEnd = titleInput.value.length;
      titleInput.scrollLeft = titleInput.scrollWidth;

    }
  },

  render: function () {

    var todoClasses = classSet({
      'input-group': true,
      'todo-item': true,
      'todo-item-complete': this.props.todo.is_complete
    });

    var editableTextClasses = classSet({
      'rb-editable-text': true,
      'rb-editable-text-editing': this.state.isBeingEdited
    });

    var id = this.props.todo.id + '-foo';

    return (
      <li className={ todoClasses }>
        <span className="input-group-addon">
          <input id="todo-{ props.todo.id }" type="checkbox" onChange={ this._onCompleteToggled } checked={ this.props.todo.is_complete } />
        </span>
        <div className={ editableTextClasses }>
          <div ref="staticTitle" onClick={ this._onTitleClicked }>{ this.props.todo.title }</div>
          <input id={ id } type="text" className="form-control" defaultValue={ this.props.todo.title } ref="titleInput" onBlur={ this._onTitleInputBlur } />
        </div>
        <span className="input-group-addon">
          <button type="button" className="btn btn-danger btn-circular" onClick={this._onDeleteClick}>
            <span className="glyphicon glyphicon-remove icon-delete"></span>
          </button>
        </span>
      </li>
    );
  },

  _onDeleteClick: function () {
    TodoStore.remove(this.props.todo.id);
  },

  _onCompleteToggled: function () {
    TodoActions.toggle(this.props.todo.id);
  },

  _onTitleClicked: function () {
    if(!this.state.isBeingEdited) {
      this.setState(assign(this.state, { isBeingEdited: true }));
    }
  },

  _onTitleInputBlur: function () {
    var titleInput = React.findDOMNode(this.refs.titleInput);
    if(this.props.todo.title !== titleInput.value) {
      TodoActions.update(this.props.todo.id, titleInput.value);
    }
    this.setState(assign(this.state, { isBeingEdited: false }));
  }

});

module.exports = TodoItem;