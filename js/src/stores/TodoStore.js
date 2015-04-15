var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var TodoConstants = require('../constants/TodoConstants');
var http = $;

var todos = null;

'use strict';

function fetchTodos (callback) {
  http.get('/api/todo/')
    .done(function (data) {
      todos = {};
      data.forEach(function (todo) {
        todos[todo.id] = todo;
      });
      callback(null, data);
    });
}

var TodoStore = assign(EventEmitter.prototype, {

  getAll: function () {
    if(todos === null) {
      fetchTodos(function () {
        this.emit(TodoConstants.TODO_LIST_CHANGE);
      }.bind(this));
    }
    return (todos || {});
  },

  remove: function (id) {
    http.ajax({
      url: '/api/todo/' + id,
      type: 'delete'
    })
      .done(function () {
        delete todos[id];
        this.emit(TodoConstants.TODO_LIST_CHANGE);
      }.bind(this));
  },

  create: function (title) {
    http.ajax({
      url: '/api/todo/',
      type: 'post',
      dataType: 'json',
      data: JSON.stringify({
        title: title
      })
    })
      .done(function (data) {
        todos[data.id] = data;
        this.emit(TodoConstants.TODO_LIST_CHANGE);
        this.emit(TodoConstants.TODO_CREATE_SUCCESS);
      }.bind(this));
  },

  toggle: function (id) {
    var todo = todos[id];
    todo.is_complete = !todo.is_complete;
    http.ajax({
      url: '/api/todo/' + todo.id,
      type: 'put',
      dataType: 'json',
      data: JSON.stringify(todo)
    })
      .done(function (data) {
        todos[data.id] = data;
        this.emit(TodoConstants.TODO_LIST_CHANGE);
      }.bind(this));
  },

  update: function (id, title) {
    var todo = todos[id];
    todo.title = title;
    http.ajax({
      url: '/api/todo/' + todo.id,
      type: 'put',
      dataType: 'json',
      data: JSON.stringify(todo)
    })
      .done(function (data) {
        todos[data.id] = data;
        this.emit(TodoConstants.TODO_LIST_CHANGE);
      }.bind(this));
  },

  addListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  }

});

var ActionHandlers = {};
ActionHandlers[TodoConstants.TODO_CREATE] = function (action) {
  var title = action.title.trim();
  TodoStore.create(title);
};

ActionHandlers[TodoConstants.TODO_TOGGLE] = function (action) {
  TodoStore.toggle(action.id);
}

ActionHandlers[TodoConstants.TODO_UPDATE] = function (action) {
  TodoStore.update(action.id, action.title);
}

AppDispatcher.register(function (action) {
  if(typeof ActionHandlers[action.actionType] !== 'function') {
    return;//No op. Not an error not to have a handler, action may not be meant for this store
  }

  ActionHandlers[action.actionType].call(AppDispatcher, action);
});

module.exports = TodoStore;