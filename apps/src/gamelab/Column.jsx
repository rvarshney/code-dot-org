/**
 * React version of the rotation overlay.
 */
var Column = React.createClass({
  propTypes: {
    id: React.PropTypes.string,
    noUpdate: React.PropTypes.bool
  },

  shouldComponentUpdate: function() {
    return !this.props.noUpdate;
  },

  render: function () {
    return <div id={this.props.id}></div>;
  }
});
module.exports = Column;
