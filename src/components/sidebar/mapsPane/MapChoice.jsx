import React from 'react';

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

  handleClick(){
    const baseBGColor = this.element.style.backgroundColor;
    const baseTColor = this.element.style.color;
    const baseBColor = this.element.style.borderColor;
    if (this.props.choice !== undefined){
      this.props.handleMapMemoryChoice(this.props.choice);
    } else {
      this.props.handleMapMemoryChoice();
    }
    this.element.style.backgroundColor = '#0A83C9';
    this.element.style.color = 'white';
    this.element.style.borderColor = 'white';
    let uploadMask;
    if (this.props.upload) {
      uploadMask = document.getElementsByClassName('mapChoice-uploadMask')[0];
      uploadMask.style.backgroundColor = '#0A83C9';
      uploadMask.style.color = 'white';
    }
    window.setTimeout(() => {
      this.element.style.backgroundColor = baseBGColor;
      this.element.style.color = baseTColor;
      this.element.style.borderColor = baseTColor;
      if (this.props.upload){
        uploadMask.style.backgroundColor = baseBGColor;
        uploadMask.style.color = baseTColor;
      }
    }, 200);
  }

  render() {
    let oddEven = this.props.order % 2 ? 'odd' : 'even';
    let rowNum = Math.ceil(this.props.order / 2);
    return (
      <div className={`mapChoice-${this.props.type} mapChoice-${this.props.type}-${this.props.order} mapsPane-choices-` + this.props.title 
                      + ' mapChoice-' + oddEven  + ' mapChoice-row-' + rowNum 
                      + (rowNum === this.props.rows ? 'mapChoice-row-preceeding' : '') }
           onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
           ref={'mapChoice-' + this.props.order} >
        <span className='mapChoice-title'>
          <span className={'mapChoice-icon fa ' + this.props.icon} /> 
          {this.props.title}
        </span>
        {this.props.upload
          ? (<div>
               <div className='mapChoice-uploadMask'/>
               <form id="mapChoice-upload-form">
                <input type="file" id="mapChoice-upload" accept="text/json"/>
               </form>
             </div>)
          : null
        }
      </div>
    );
  }
}
 export default MapChoice;