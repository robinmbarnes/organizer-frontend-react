var React = require('react');
var TodoList = require('./components/TodoList.react');
var AsyncButton = require('./components/AsyncButton.react');
var TodoInputViewController = require('./components/TodoInputViewController.react');


React.render(
  <TodoInputViewController/>,
  document.getElementById('todo-input')
);

React.render(
  <TodoList/>,
  document.getElementById('todo-list')
);

/*
<!--<rb-async-button ng-model="addButton.isProcessing" class="btn btn-success" type="submit">
  <span>
    <span class="glyphicon glyphicon-plus"></span>
  Add item
  </span>
</rb-async-button>-->*/