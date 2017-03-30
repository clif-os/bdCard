import React from 'react';

class MapChoice extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false,
      mouseDown: false,
      clicked: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(){
    this.element = this.refs['mapChoice-' + this.props.order];
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

  handleMouseDown(){
    this.setState({
      mouseDown: true
    });
  }

  handleMouseUp(){
    if (this.state.mouseDown){
      this.handleClick();
    }
    this.setState({
      mouseDown: false
    });
  }

  handleClick(e){
    this.props.handleMapMemoryChoice(this.props.choice);
    this.setState({
      clicked: true
    });
    window.setTimeout(() => {
      this.setState({
        clicked: false
      });
    }, 200)
  }

  render() {
    let oddEven = this.props.order % 2 ? 'odd' : 'even';
    let rowNum = Math.ceil(this.props.order / 2);
    const className= `mapsPane-${this.props.type}Button mapsPane-${this.props.type}Button-${this.props.order} mapsPane-choices-${this.props.title}
                mapsPane-button mapsPane-button-${oddEven} mapsPane-buttonRow-${rowNum}`
                + (rowNum === this.props.rows ? ' mapsPane-buttonRow-preceeding' : '')
                + ` mapsPane-${this.props.type}Button-` + (this.state.clicked ? 'clicked' : 'notClicked');
    return (
      <div className={className}
           onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
           onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
           ref={'mapChoice-' + this.props.order} >
        <span className='mapsPane-button-title'>
          <span className={'mapsPane-button-icon fa ' + this.props.icon} /> 
          {this.props.title}
        </span>
      </div>
    );
  }
}
 export default MapChoice;