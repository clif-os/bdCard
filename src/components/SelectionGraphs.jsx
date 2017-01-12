import React, { Component } from 'react';
import SelectionGraphRenderer from './SelectionGraphRenderer.jsx';
import './SelectionGraphs.styl';
import { convertBostonPropsToReactD3Data, createD3Range, findAllValsOfAxis } from '../utils/d3Utils.jsx';
import { numberWithCommas } from '../utils/generalUtils.jsx';
var LineChart = require('react-d3').LineChart;

class SelectionGraphs extends Component {
  constructor(props){
    super();
    // FIXED SPECS CONSTRUCTION
    const xAccessor = d => {
      return d.x;
    }
    var yAccessor = d => {
      return d.y;
    }
    const fixedSpecs = {
      margins: {left: 50, right: 12, top: 10, bottom: 20},
      width: 270,
      height: 200,
      xAccessor: xAccessor,
      yAccessor: yAccessor,
      gridHorizontal: true,
      legend: false
    }
    this.state = {
      fixedSpecs: fixedSpecs
    }
  }

  render() {
    const fixedSpecs = this.state.fixedSpecs;
    const data = convertBostonPropsToReactD3Data(this.props.selectedFeatureProperties, this.props.yFields[0]);
    const xVals = findAllValsOfAxis(data, 'x')
    const xAxisFormatter = (n) => {
      if (xVals.indexOf(n) >= 0) {
        return n  
      } else {
        return ''
      }
    }
    const yAxisFormatter = n => {
      return '$' + String(numberWithCommas(n)) 
    }
    const dynamicSpecs = {
      data:data,
      xAxisFormatter: xAxisFormatter,
      yAxisFormatter: yAxisFormatter
    }
    const title = data[0].name
    // console.log("LOADING DATA INTO CHART:");
    return(
      <div className="selectionGraphs">
          <div className="chartTitleBar"><span className="chartTitle">{title}</span></div>
          <LineChart
            data={dynamicSpecs.data}
            width={fixedSpecs.width}
            height={fixedSpecs.height}
            margins={fixedSpecs.margins}
            xAccessor={fixedSpecs.xAccessor}
            xAxisFormatter={dynamicSpecs.xAxisFormatter}
            yAccessor={fixedSpecs.yAccessor}
            yAxisFormatter={dynamicSpecs.yAxisFormatter}
            gridHorizontal={fixedSpecs.gridHorizontal}
            legend={fixedSpecs.legend}
          />
      </div>
    )
  }
}

export default SelectionGraphs;

// <div className="selectionGraphs">
//           <div className="chartTitleBar"><span className="chartTitle">{title}</span></div>
//           <LineChart
//             data={data}
//             chartSeries={chartSeries}
//             margins={margins}
//             width={width}
//             height={height}
//             showLegend={false}
//             x={x}
//             xDomain={xDomain}
//             xAxisTickValues={[2000]}
//             xAxisTickCount={4}
//             y={y}
//             yDomain={yDomain}
//             yRange={yRange}
//           />
//       </div>

    // const yDomain = createD3Range(data, 0, 'x', 0.1);
    // const xDomain = createD3Range(data, 0, 'y', 0.05);
    // const domain = {
    //   x: xDomain,
    //   y: yDomain
    // }
    // by the time 'd' makes its way to the y-parser, it seems to be missing any other props and is simply the y-value
    // thus, you need only return 'd'