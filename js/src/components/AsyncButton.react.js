var React = require('react');
var assign = require('object-assign');

var AsyncButton = React.createClass({

  onClickListeners: [],

  /*_onClick: function () {
    this.onClickListeners.forEach( function (listener) {
      listener.call(this);
    });
  },*/

  getInitialState: function () {
    return {
      isProcessing: false
    };
  },

  startProcessing: function () {
    this.setState(assign(this.state, { isProcessing: true }));
  },

  stopProcessing: function () {
    this.setState(assign(this.state, { isProcessing: false }));
  },

  render: function () {

    var classString = 'btn-async btn ' + this.props.buttonType;
    if(this.state.isProcessing === true) {
      classString += ' btn-async-processing';
    }
    return (
      <button type="submit" className={ classString } onClick={ this.props.onClick } >
        <div className="btn-async-content">
          <span>{ this.props.label }</span>
        </div>
        <div className="btn-async-transition">
          <div className="centered">
            <div className="centered-inner">
              <div className="glyphicon glyphicon-refresh spinning centered-content"></div>
            </div>
          </div>
        </div>
      </button>
    );
  }

});

module.exports = AsyncButton;
