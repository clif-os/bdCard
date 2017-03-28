import React from 'react';
import './SavedMapChoice.styl';
import { VelocityTransitionGroup } from 'velocity-react';

class SavedMapChoice extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false,
      clicked: false,
      controlHovered: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDeleteSavedMemory = this.handleDeleteSavedMemory.bind(this);
    this.handleControlEnter = this.handleControlEnter.bind(this);
    this.handleControlLeave = this.handleControlLeave.bind(this);
  }

  componentDidMount(){
    // this.element = this.refs['savedMapChoice-' + this.props.order];
  }

  handleMouseEnter(){
    // this.element.style.textAlign = 'left';
    if (! this.state.controlHovered){
      this.setState({
        hover: true
      });
    }
  }

  handleMouseLeave(){
    // this.element.style.textAlign = 'center';
    this.setState({
      hover: false
    })
  }

  handleControlEnter(){
    console.log('entering control')
    this.setState({
      controlHovered: true,
      hover: false
    });
  }

  handleControlLeave(){
    this.setState({
      controlHovered: false
    });
  }

  handleClick(){
    if (!this.state.controlHovered) {
      if (this.props.choice !== undefined){
        this.props.handleMapMemoryChoice(this.props.choice);
      } else {
        this.props.handleMapMemoryChoice();
      }
      this.setState({
        clicked: true
      });
      window.setTimeout(() => {
        this.setState({
          clicked: false
        });
      }, 200)
    }
  }

  handleDeleteSavedMemory(){
    // pass in the index since the memories are stored in a list (ther order is index + 1)
    this.props.handleDeleteSavedMemory(this.props.order - 1);
  }

  render() {
    let oddEven = this.props.order % 2 ? 'odd' : 'even';
    let rowNum = Math.ceil(this.props.order / 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.choice.memory));
    return (
      <div className={`savedMapChoice mapChoice-${this.props.type} mapsPane-choices-` + this.props.title 
                      + ' mapChoice-' + oddEven  + ' mapChoice-row-' + rowNum 
                      + (rowNum === this.props.rows ? 'mapChoice-row-preceeding' : '') 
                      + (this.state.clicked ? ' savedMapChoice-clicked' : '')}
           onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
           ref={'savedMapChoice-' + this.props.order} >
        <span className='mapChoice-title savedMapChoice-title'>
          <span className={'mapChoice-icon fa ' + this.props.icon} /> 
          {this.props.title}
        </span>
        <div className='savedMapChoice-controls '>
          <div className='savedMapChoice-control savedMapChoice-control-delete' 
               onClick={this.handleDeleteSavedMemory}
               onMouseEnter={this.handleControlEnter} onMouseLeave={this.handleControlLeave}>

            <span className='fa fa-trash savedMapChoice-control-icon' />
          </div>
          <a href={dataStr} download='mapSession.json'>
            <div className='savedMapChoice-control savedMapChoice-control-download'
                onMouseEnter={this.handleControlEnter} onMouseLeave={this.handleControlLeave}>
              <span className='fa fa-download savedMapChoice-control-icon' />
            </div>
          </a>
        </div>
      </div>
    );
  }
}
 export default SavedMapChoice;

//  {/*<div className=/*/}