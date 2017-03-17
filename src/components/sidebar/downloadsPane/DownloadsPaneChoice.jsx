import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

class DownloadsPaneChoice extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter(){
    this.setState({
      hover: true
    })
  }

  handleMouseLeave(){
    this.setState({
      hover: false
    })
  }

  render() {
    return (
      <div className={'downloadsPane-choice downloadsPane-choices-' + this.props.type} 
           onClick={this.props.handleDownload} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span className='downloadsPane-choice-title'>
          {this.state.hover
            ? <span className= 'downloadsPane-choice-icon fa fa-download' /> 
            : <span className={'downloadsPane-choice-icon fa ' + this.props.icon} /> 
          }
          {this.props.type.toUpperCase()}
        </span>
      </div>
    );
  }
}
 export default DownloadsPaneChoice;