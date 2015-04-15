var React = require('react');
var AsyncButton = require('../components/AsyncButton.react');
var TodoStore = require('../stores/TodoStore');
var TodoConstants = require('../constants/TodoConstants');
var TodoActions = require('../actions/TodoActions');

var TodoInputViewController = React.createClass({

  componentDidMount: function () {
    TodoStore.addListener(TodoConstants.TODO_CREATE_SUCCESS, this._onCreateTodoSuccess);
  },

  componentWillUnmount: function () {
    TodoStore.removeListener(TodoConstants.TODO_CREATE_SUCCESS, this._onCreateTodoSuccess);
  },

  _onCreateTodoSuccess: function () {
    this.refs.addButton.stopProcessing();
  },

  _onFormSubmitted: function (e) {
    e.preventDefault();
    this.refs.addButton.startProcessing();
    var textInput = React.findDOMNode(this.refs.todoTitle);
    TodoActions.create(textInput.value);
    textInput.value = '';
  },

  render: function () {

    return (
      <form name="todoCreateForm" onSubmit={ this._onFormSubmitted }>
        <div className="input-group input-group-lg standalone">
          <input type="text" className="form-control" placeholder="I need to..." required ref="todoTitle" />
            <span className="input-group-btn">
              <AsyncButton ref="addButton" label="Add item" buttonType="btn-success" onClick={ this._onAddButtonClicked } />
            </span>
          </div>
        </form>
    );
  }

});

module.exports = TodoInputViewController;
