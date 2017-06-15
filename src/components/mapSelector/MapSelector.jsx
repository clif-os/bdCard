import React, { Component } from 'react';
import './MapSelector.styl';
import MapOption from './MapOption.jsx';

import { mapStyleNodes } from '../map/mapStyle_data.jsx';

const renderOptions = (options, handleChoice, chosenId) => {
  const nodes = options.map((option, i) => {
    const { title, description, img } = option;
    const { url } = img;
    const nodeId = i + 1;
    return (
      <MapOption 
        key={i} nodeId={nodeId} handleChoice={handleChoice}
        title={title} description={description} imgUrl={url}
        optionData={option} chosen={nodeId === chosenId}
        optionChosen={chosenId !== null}
      />
    )
  });
  return (
    <div className="mapOptions-container">
      {nodes}
    </div>
  )
}

export default class MapSelector extends Component {
  constructor(props) {
    super();
    this.state = {
      chosenId: null,
    }
    this.hMapChoice = this.hMapChoice.bind(this);
  }

  hMapChoice(optionData, nodeId) {
    this.setState({
      chosenId: nodeId
    });
    const { handleMapChoice } = this.props;
    handleMapChoice();
  }

  render() {
    const { chosenId } = this.state;
    return (
      <div className='mapSelector'>
        {renderOptions(mapStyleNodes, this.hMapChoice, chosenId)}
      </div>
    )
  }
}
