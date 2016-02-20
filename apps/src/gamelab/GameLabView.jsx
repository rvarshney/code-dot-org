var Column = require('./Column.jsx');
var RotateContainer = require('./RotateContainer.jsx');

/**
 * Top-level view component for Gamelab
 */
var GameLabView = React.createClass({
  propTypes: {
    assetUrl: React.PropTypes.func.isRequired,
    onMount: React.PropTypes.func
  },

  componentDidMount: function () {
    this.props.onMount(this.refs.placeholder.getDOMNode());
  },

  render: function () {
    return <div ref="placeholder">
      <RotateContainer assetUrl={this.props.assetUrl} />
      <Column id="visualizationColumn" noUpdate={true} />
      <div id="visualizationResizeBar" className="fa fa-ellipsis-v"></div>
      <Column id="codeWorkspace" noUpdate={true} />
      <div className="clear"></div>
    </div>;
  }
});
module.exports = GameLabView;
