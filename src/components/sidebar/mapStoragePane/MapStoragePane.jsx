import React from 'react';
import './MapStoragePane.styl';

class MapStoragePane extends React.Component {
  constructor(props){
    super();
    this.transitionOut = this.transitionOut.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.handleYes = this.handleYes.bind(this);
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e){
    if (e.keyCode === 27){
      this.handleNo();
    } else if (e.keyCode === 13){
      this.handleYes();
    }
  }

  transitionOut(){
    var mapStoragePaneStyle = this.refs["mapStoragePane"].style;
    var optionsContainerStyle = this.refs["mapStoragePane-optionsContainer"].style;
    mapStoragePaneStyle.backgroundColor = 'rgba(255,255,255, 0)';
    optionsContainerStyle.top = '-100px';
  }

  handleYes(){
    this.transitionOut();
    window.setTimeout(() => {
      this.props.handleMapStorageChoice(true)
    }, 250);
  }

  handleNo(){
    this.transitionOut();
    window.setTimeout(() => {
      this.props.handleMapStorageChoice(false)
    }, 250);
  }

  render() {
    return (
      <div className="mapStoragePane" ref="mapStoragePane">
        <div className="mapStoragePane-optionsContainer" ref="mapStoragePane-optionsContainer">
          <div className="optionsContainer-titleContainer optionsContainer-container">
            <span className="optionsContainer-title">
              Load Previous Session?
            </span>
          </div>
          <div className="optionsContainer-buttonsContainer optionsContainer-container">
            <div className="buttonsContainer-button buttonsContainer-button-yes"
                 onClick={this.handleYes} >
              Yes
            </div>
            <div className="buttonsContainer-button buttonsContainer-button-no"
                 onClick={this.handleNo} >
              No
            </div>
          </div> 
        </div>
      </div>
    );
  }
}
 export default MapStoragePane;