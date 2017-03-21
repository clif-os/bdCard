import React from 'react';
import {verifyMemory} from '../mapMemories/memoryVerifier.jsx';

class UploadMapButton extends React.Component {
  constructor(props){
    super();
    this.state = {
      hover: false,
      mouseDown: false
    }
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.element = this.refs['mapChoice-' + this.props.order];
    var uploader = document.getElementById('mapChoice-upload');
    uploader.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const fr = new FileReader();
      let message;
      fr.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          const {verified, message} = verifyMemory(json);
          if (verified) {
            console.log('verified')
            this.props.saveMap(json);
            uploader.value = ""
          } else {
            console.log('not verified')
            uploader.value = ""
          }
        } catch (e) {
          console.log('NOT A VALID JSON FILE');
          message = 'Not a valid JSON file'
          uploader.value = ""
        }
      }
      fr.readAsText(file);
    });
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
    const baseBGColor = this.element.style.backgroundColor;
    const baseTColor = this.element.style.color;
    const baseBColor = this.element.style.borderColor;
    this.element.style.backgroundColor = '#0A83C9';
    this.element.style.color = 'white';
    this.element.style.borderColor = 'white';
    ///////
    var uploader = document.getElementById('mapChoice-upload')
    uploader.click();
    ///////
    let uploadMask = document.getElementsByClassName('mapChoice-uploadMask')[0];
    uploadMask.style.backgroundColor = '#0A83C9';
    uploadMask.style.color = 'white';
    window.setTimeout(() => {
      this.element.style.backgroundColor = baseBGColor;
      this.element.style.color = baseTColor;
      this.element.style.borderColor = baseTColor;
      uploadMask.style.backgroundColor = baseBGColor;
      uploadMask.style.color = baseTColor;
    }, 200);
  }

  render() {
    let oddEven = this.props.order % 2 ? 'odd' : 'even';
    let rowNum = Math.ceil(this.props.order / 2);
    return (
      <div className={`mapChoice-${this.props.type} mapChoice-${this.props.type}-${this.props.order} mapsPane-choices-` + this.props.title 
                      + ' mapChoice-' + oddEven  + ' mapChoice-row-' + rowNum 
                      + (rowNum === this.props.rows ? 'mapChoice-row-preceeding' : '') }
           onMouseUp={this.handleMouseUp} onMouseDown={this.handleMouseDown}
           onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
           ref={'mapChoice-' + this.props.order} >
        <span className='mapChoice-title'>
          <span className={'mapChoice-icon fa ' + this.props.icon} /> 
          {this.props.title}
        </span>
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