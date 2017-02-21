import React from 'react';
import './OnOffSlider.styl'

class OnOffSlider extends React.Component {
  constructor(props) {
    super();
    this.state = {
      on: props.active !== undefined ? props.active : true
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.setState({
      on: !this.state.on
    });
    this.props.handleFilterOnOff();
  }

  render() {
    return (
      <div className={'onOffSlider onOffSlider-' + (this.state.on ? 'on' : 'off')}>
        <div className='slidingContainer' onClick={this.handleClick}>
          <div className='slidingBead'/>
        </div>
      </div>
    );
  }
}

export default OnOffSlider;