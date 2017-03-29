import './UploadMapButton.styl';
import React from 'react';
import {verifyMemory} from '../mapMemories/memoryVerifier.jsx';
import {VelocityTransitionGroup} from 'velocity-react';

class UploadMapButton extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false,
      mouseDown: false,
      animationOngoing: false,
      animationType: null,
      animationIcon: null,
      animationDurationUnit: 150,
      animationStartDefault: true,
      clicked: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.animation = this.animation.bind(this);
  }

  componentDidMount(){
    this.element = this.refs['mapChoice-' + this.props.order];
    var uploader = document.getElementById('mapChoice-upload');
    uploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const fr = new FileReader();
      let message;
      let success = false;
      fr.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          var {verified, message} = verifyMemory(json);
          if (verified) {
            this.props.saveMap(json);
            message = 'Upload Successful'
            uploader.value = ""
            success = true;
          } else {
            console.log('not verified')
            message = 'JSON Structure Invalid'
            uploader.value = ""
          }
        } catch (e) {
          message = 'Not a Valid JSON File'
          uploader.value = ""
        }
        this.animation(success ? 'success' : 'failure', message);
      }
      fr.readAsText(file);
    });
  }

  animation(type, message){
    console.log({type}, {message});
    let icon;
    switch(type){
      case 'success':
        icon = 'fa-check-circle-o';
        break;
      case 'failure':
        console.log('setting to failure')
        icon = 'fa-exclamation-circle';
        break;
      default:
        break;
    }
    // LOCK THE BUTTON AND SEND DEFAULT MESSAGE AWAY
    const button  = document.getElementById('uploadMapButton');
    button.style.pointerEvents = 'none';

    let animationSchedule = 0;
    this.setState({
      animationStartDefault: false
    });
    
    // BRING IN NEW MESSAGE
    animationSchedule += this.state.animationDurationUnit;
    window.setTimeout(() => {
      this.setState({
        animationOngoing: true,
        animationType: type,
        animationIcon: icon,
        animationMessage: message,
        animationStartMessage: true
      });
    }, animationSchedule);
    
    // SEND ANIMATION MESSAGE AWAY
    animationSchedule += 2000;
    window.setTimeout(() => {
      this.setState({
        animationStartMessage: false
      });
    }, animationSchedule);
    
    // BRING THE DEFAULT BACK
    animationSchedule += this.state.animationDurationUnit;
    window.setTimeout(() => {
      this.setState({
        animationOngoing: false,
        animationStartDefault: true,
        animationType: null,
        animationIcon: null,
        animationMessage: null
      });
    }, animationSchedule);
    // RESET POINTER EVENTS
    animationSchedule += this.state.animationDurationUnit;
    window.setTimeout(() => {
      button.style.pointerEvents = 'auto';
    }, animationSchedule);
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
    ///////
    var uploader = document.getElementById('mapChoice-upload')
    uploader.click();
    ///////
    this.setState({
      clicked: true
    });
    window.setTimeout(() => {
      this.setState({
        clicked: false
      });
    }, 200);
  }

  render() {
    let oddEven = this.props.order % 2 ? 'odd' : 'even';
    let rowNum = Math.ceil(this.props.order / 2);
    const className = `mapChoice-${this.props.type} mapChoice-${this.props.type}-${this.props.order}  mapsPane-choices-${this.props.title} 
                       mapsPane-button mapsPane-button-${oddEven} mapsPane-buttonRow-${rowNum} `
                       + (rowNum === this.props.rows ? 'mapChoice-row-preceeding' : '')
                       + (this.state.clicked ? ` mapChoice-${this.props.type}-clicked` : ` mapChoice-${this.props.type}-notClicked`);
    return (
      <div className={className}
           id='uploadMapButton'
           onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
           onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
           ref={'mapChoice-' + this.props.order} >
        <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{
            animation: "transition.slideRightIn",
            duration: this.state.animationDurationUnit
          }}
            leave={{
            animation: "transition.slideLeftOut",
            duration: this.state.animationDurationUnit
          }}>
        {this.state.animationStartDefault
          ? (<span className='mapsPane-button-title'>
              <span className={'mapsPane-button-icon fa ' + this.props.icon} /> 
              {this.props.title}
            </span>)
          : null
        }
        </VelocityTransitionGroup>
        <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{
            animation: "transition.slideRightIn",
            duration: this.state.animationDurationUnit
          }}
            leave={{
            animation: "transition.slideLeftOut",
            duration: this.state.animationDurationUnit
          }}>
        {this.state.animationStartMessage
          ? (<span className={'mapsPane-button-title mapChoice-title-' + this.state.animationType}>
              <span className={'mapsPane-button-icon fa ' + this.state.animationIcon} /> 
              {this.state.animationMessage}
            </span>)
          : null
        }
        </VelocityTransitionGroup>
        <div>
          <div className='mapChoice-uploadMask'/>
          <form id="mapChoice-upload-form">
          <input type="file" id="mapChoice-upload" accept="text/json"/>
          </form>
        </div>
      </div>
    );
  }
}
 export default UploadMapButton;