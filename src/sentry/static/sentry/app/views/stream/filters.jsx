/*** @jsx React.DOM */

var React = require("react");
var Router = require("react-router");

var utils = require("../../utils");

var SearchDropdown = React.createClass({
  propTypes: {
    dropdownVisible: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      dropdownVisible: false
    };
  },

  render() {
    var style = {
      display: this.props.dropdownVisible ? 'block' : 'none'
    };

    return (
      <div className="search-dropdown" style={style}>
        <ul className="search-helper search-autocomplete-list">
          <li className="search-autocomplete-item">
            <span className="icon icon-tag"></span>
            <h4>Tag - <span className="search-description">key/value pair associated to an event</span></h4>
            <p className="search-example">browser:"Chrome 34"</p>
          </li>
          <li className="search-autocomplete-item">
            <span className="icon icon-toggle"></span>
            <h4>Status - <span className="search-description">State of an event</span></h4>
            <p className="search-example">is:resolved, unresolved, muted</p>
          </li>
          <li className="search-autocomplete-item">
            <span className="icon icon-user"></span>
            <h4>Assigned - <span className="search-description">team member assigned to an event</span></h4>
            <p className="search-example">assigned:[me|user@example.com]</p>
          </li>
        </ul>
      </div>
    );
  }
});

var SearchBar = React.createClass({
  mixins: [Router.State],

  propTypes: {
    query: React.PropTypes.string.isRequired,
    onQueryChange: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      dropdownVisible: false
    };
  },

  onQueryChange(event) {
    return this.props.onQueryChange(event.target.value, event);
  },

  onQueryFocus() {
    this.setState({
      dropdownVisible: true
    });
  },

  onQueryBlur() {
    this.setState({
      dropdownVisible: false
    });
  },

  render() {
    return (
      <div className="search">
        <form className="form-horizontal">
          <div>
            <input type="text" className="search-input form-control"
                   placeholder="Search for events, users, tags, and everything else."
                   name="query"
                   value={this.props.query}
                   onFocus={this.onQueryFocus}
                   onBlur={this.onQueryBlur}
                   onChange={this.onQueryChange} />
            <span className="icon-search"></span>
          </div>
          <SearchDropdown dropdownVisible={this.state.dropdownVisible} />
        </form>
      </div>
    );
  }
});

var FilterSelectLink = React.createClass({
  mixins: [Router.State],

  render() {
    var className = this.props.extraClass;
    className += ' btn btn-default';

    if (this.props.isActive) {
      className += ' active';
    }

    var queryString = '?' + this.props.query;

    return (
      <Router.Link
          to="stream"
          activeClassName=""
          params={this.getParams()}
          query={this.props.query}
          className={className}>
        {this.props.label}
      </Router.Link>
    );
  }
});

var StreamFilters = React.createClass({
  propTypes: {
    query: React.PropTypes.string.isRequired,
    onQueryChange: React.PropTypes.func.isRequired
  },

  render() {
    var params = utils.getQueryParams();
    var activeButton;
    if (params.bookmarks) {
      activeButton = 'bookmarks';
    } else if (params.assigned) {
      activeButton = 'assigned';
    } else {
      activeButton = 'all';
    }

    return (
      <div className="filter-nav" ng-controller="ProjectStreamControlsCtrl">
        <div className="row">
          <div className="col-sm-4 primary-filters">
            <div className="btn-group btn-group-justified">
              <FilterSelectLink label="All Events"
                                query={{}}
                                isActive={activeButton === 'all'}
                                extraClass="btn-all-events" />
              <FilterSelectLink label="Bookmarks"
                                query={{bookmarks: '1'}}
                                isActive={activeButton === 'bookmarks'}
                                extraClass="btn-middle btn-bookmarks" />
              <FilterSelectLink label="Assigned"
                                query={{assigned: '1'}}
                                isActive={activeButton === 'assigned'}
                                extraClass="btn-assigned" />
            </div>
          </div>
          <div className="col-sm-8">
            <SearchBar query={this.props.query} onQueryChange={this.props.onQueryChange} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = StreamFilters;