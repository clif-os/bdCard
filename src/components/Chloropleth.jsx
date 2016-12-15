import React, {Component} from 'react';
import {ChoroplethLayer} from 'deck.gl';
class Chloropleth extends Component {
  render() {
    const {viewport} = this.props;
    const layer = new ChloroplethLayer({
      id: 'chloropleth', 
      data: [0,100],
      opacity: Math.min(1, Math.max(0, 3 - 1 / 3)),
      getColor: f => {
        const r = f.properties.value / 3000; 
        return [255, 255 * (1-r), 0]
      }
    });
    return (
      <DeckGL {...viewport} layers={[layer]} />
    )
  }
}

export default Chloropleth;