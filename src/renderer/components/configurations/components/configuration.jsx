'use babel';

import React from 'react';

import DB from '../../libraries/db';
let DBClient = DB.DBClient('repositories');


var FORM_STATES = [
  'NOT_STARTED',
  'INVALID',
  'ADDED'
]

var Configuration = React.createClass({
  getInitialState: function() {
    return {name: '', cctrayTrackingURL: '', formState: FORM_STATES[0]};
  },

  handleNameChange: function(e) {
    if (e.target.value !== this.state.name) {
      this.setState({name: e.target.value});
    }
  },

  handleCCTrayTrackingURLChange: function(e) {
    if (e.target.value !== this.state.cctrayTrackingURL) {
      this.setState({cctrayTrackingURL: e.target.value});
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    var cctrayTrackingURL = this.state.cctrayTrackingURL.trim();
    if (!cctrayTrackingURL || !name) {
      this.setState({formState: FORM_STATES[1]});
      return;
    }
    var inserted = DBClient.insert({name: name, cctrayTrackingURL: cctrayTrackingURL});
    if (inserted) {
      this.setState({name: '', cctrayTrackingURL: '', formState: FORM_STATES[2]});
    } else {
      this.setState({formState: FORM_STATES[1]});
      setTimeout(function() {
        this.setState({formState: FORM_STATES[0]});
      }.bind(this), 2000);
    }
  },

  render: function() {

    var message  = '';
    if (this.state.formState === FORM_STATES[2]) {
      message = <div className="notify-success">Repository information added</div>;
    } else if (this.state.formState === FORM_STATES[1]) {
      message = <div className="notify-error">All the fields are required</div>;
    }

    return (
      <div>
        <h1>Build Checker App</h1>
        { message }
        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>Configurations</legend>

            <label htmlFor="name">Repository name</label>
            <input id="name" type="text"
            className="pure-input-1"
            placeholder="Repository name"
            value={this.state.name}
            onChange={this.handleNameChange} />

            <label htmlFor="cctrayTrackingURL">CCTray Repo URL</label>
            <input id="cctrayTrackingURL" type="text"
            className="pure-input-1"
            placeholder="Repository name"
            value={this.state.cctrayTrackingURL}
            onChange={this.handleCCTrayTrackingURLChange} />

            <button type="submit" className="button-xlarge pure-button pure-button-primary">ADD</button>
          </fieldset>
        </form>
      </div>
    );
  }
});


export default Configuration;
