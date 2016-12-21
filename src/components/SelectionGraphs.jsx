import React, { Component } from 'react';
import './SelectionGraphs.styl';
import { convertBostonPropsToD3Array, createD3Range } from '../utils/d3Utils.jsx';
var Chart = require('react-d3-core').Chart;
var LineChart = require('react-d3-basic').LineChart;

class SelectionGraphs extends Component {
  constructor(props){
    super();
  }

  render() {
    console.log(this.props.selectedFeatureProperties)
    const data = convertBostonPropsToD3Array(this.props.selectedFeatureProperties, this.props.fieldsToGraph[0]);
    // const yRange = createD3Range(data, this.props.fieldsToGraph[0], 0.1);
    const yDomain = createD3Range(data, this.props.fieldsToGraph[0], 0.1);
    var margins = {left: 45, right: 10, top: 10, bottom: 20},
    width = 270,
    height = 200,
    yRange = [(height - margins.top - margins.bottom), 0],
    chartSeries = [
      {
        field: 'MedInc',
        name: 'year',
        color: 'red'
      }
    ],
    title = chartSeries[0].field,
    // your x accessor
    x = function(d) {
      return d.index;
    }
    console.log("LOADING DATA INTO CHART:");
    return(
      <div className="selectionGraphs">
          <div className="chartTitleBar"><span className="chartTitle">{title}</span></div>
          <LineChart
            title={title}
            margins={margins}
            data={data}
            chartSeries={chartSeries}
            x={x}
            width={width}
            height={height}
            yDomain={yDomain}
            yRange={yRange}
            showLegend={false}
          />
      </div>
    )
  }
}

export default SelectionGraphs;