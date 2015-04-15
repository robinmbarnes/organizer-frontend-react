var React = require('react/lib/ReactWithAddons');
var TodoStore = require('../stores/TodoStore');
var TodoItem = require('./TodoItem.react');
var TodoConstants = require('../constants/TodoConstants');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

function getState() {
  return {
    todos: TodoStore.getAll()
  };
}

TodoList = React.createClass({

  getInitialState: function () {
    return getState();
  },

  componentDidMount: function () {
    TodoStore.addListener(TodoConstants.TODO_LIST_CHANGE, this._onChange);
  },

  render: function () {

    if(Object.keys(this.state.todos).length < 1) {
      return null;
    }

    var todos = [];
    for(var i in this.state.todos) {
      todos.push(this.state.todos[i]);
    }

    todos = todos.sort(function (a, b) {
      var dateA = new Date(a.created_at);
      var dateB = new Date(b.created_at);

      if(dateA > dateB) {
        return -1;
      }

      if(dateA == dateB) {
        if(a.id > b.id) {
          return -1;
        } else {
          return 1;
        }
      }

      return 1;
    })
      .map(function (todo) {
        return(<TodoItem key={ todo.id } todo={ todo } />);
      });

    return (
      <ul className="input-group-list">
        <ReactCSSTransitionGroup transitionName="todo" transitionEnter={false}>
          { todos }
        </ReactCSSTransitionGroup>
      </ul>
    );
  },

  _onChange: function () {
    this.setState(getState());
  }

});


module.exports = TodoList;