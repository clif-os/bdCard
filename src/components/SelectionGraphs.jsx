import React, { Component } from 'react';
import './SelectionGraphs.styl';
import { convertBostonPropsToReactD3Data, createD3Range, findAllValsOfAxis } from '../utils/d3Utils.jsx';
var LineChart = require('react-d3').LineChart;

class SelectionGraphs extends Component {
  constructor(props){
    super();
  }

  render() {
    const data = convertBostonPropsToReactD3Data(this.props.selectedFeatureProperties, this.props.fieldsToGraph[1]);
    console.log(data);
    // const chartSeries = [
    //   {
    //     field: 'MedInc',
    //     name: 'MedInc',
    //     year: 'year',
    //     color: 'red'
    //   }
    // ];
    const yDomain = createD3Range(data, 0, 'x', 0.1);
    const xDomain = createD3Range(data, 0, 'y', 0.05);
    const domain = {
      x: xDomain,
      y: yDomain
    }
    console.log(domain);
    var margins = {left: 45, right: 12, top: 10, bottom: 20},
    width = 270,
    height = 200
    var xAccessor = d => {
      return d.x;
    }
    const xVals = findAllValsOfAxis(data, 'x')
    var xAxisFormatter = (n) => {
      if (xVals.indexOf(n) >= 0) {
        return n  
      } else {
        return ''
      }
    }
    var yAxisFormatter
    // by the time 'd' makes its way to the y-parser, it seems to be missing any other props and is simply the y-value
    // thus, you need only return 'd'
    var yAccessor = d => {
      return d.y;
    }
    var yAxisFormatter = n => {
      return '$' + String(n) 
    }
    const title = data[0].name
    console.log("LOADING DATA INTO CHART:");
    console.log(data);
    return(
      <div className="selectionGraphs">
          <div className="chartTitleBar"><span className="chartTitle">{title}</span></div>
          <LineChart
            axesColor={'#000'}
            data={data}
            width={width}
            height={height}
            margins={margins}
            domain={domain}
            xAxisClassname="xAxis"
            xAccessor={xAccessor}
            xAxisFormatter={xAxisFormatter}
            yAxisClassname="yAxis"
            yAccessor={yAccessor}
            yAxisFormatter={yAxisFormatter}
            gridHorizontal={true}
            legend={false}
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