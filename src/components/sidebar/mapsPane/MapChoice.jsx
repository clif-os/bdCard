import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';

class MapChoice extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  handleClick(){
    this.props.handleMapMemoryChoice(this.props.choice);
  }

  render() {
    return (
      <div className={'mapChoice mapsPane-choices-' + this.props.title} 
           onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <span className='mapChoice-title'>
          {this.state.hover
            ? <span className= 'mapChoice-icon fa fa-map-o' />
            : <span className={'mapChoice-icon fa ' + this.props.icon} /> 
          }
          {this.props.title}
        </span>
      </div>
    );
  }
}
 export default MapChoice;