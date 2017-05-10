import './DownloadsPane.styl';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import DownloadsPaneChoice from './DownloadsPaneChoice.jsx';

import { fitMapToPage } from './downloadsUtils.jsx';

var memory = {}

class DownloadsPane extends React.Component {
  constructor(props){
    super();
    this.state = {
      showingPane: false,
      dataType: memory.dataType === undefined ? 'all' : memory.dataType
    }
    this.handleJSONCTDownload = this.handleJSONCTDownload.bind(this);
    this.handleJSONMSDownload = this.handleJSONMSDownload.bind(this);
    this.handleDataTypeClick = this.handleDataTypeClick.bind(this);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    });
  }

  componentDidUpdate(){
    memory = this.state;
  }

  handleDataTypeClick(e){
    const selDataType = e.target.id.split('-')[e.target.id.split('-').length - 1];
    const currDataType = this.state.dataType;
    if (selDataType !== currDataType){
      if (selDataType === 'all'){
        this.setState({
          dataType: 'all'
        });
      } else if (selDataType === 'filtered') {
        this.setState({
          dataType: 'filtered'
        });
      } else {
        console.error('invalid value in place for DownloadsPane state.dataType: ', selDataType);
      }  
    }
  }
  
  handlePDFDownload(){
    alert('PDF download under development');
    const mapCanvas = document.querySelector('.mapboxgl-canvas');
    const {orientation, dWidth, dHeight, iWidth, iHeight, left, top} = fitMapToPage(mapCanvas);
    const mapImgData = mapCanvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'in',
      format: [dWidth, dHeight]
    });
    pdf.addImage(mapImgData, 'JPEG', left, top, iWidth, iHeight);

    // /////////////////////////////////////
    // /// ADD LEGEND TO PDF
    // /////////////////////////////////////

    // let legend = document.querySelector('.legend-mainContent');
    // const lHeight = legend.clientHeight;
    // const lWidth = legend.clientWidth;
    // var legendCanvas = document.getElementById('legendCanvas');
    // // legendCanvas.style.height = `${lHeight}px`;
    // // legendCanvas.style.width = `${lWidth}px`;
    // var legendCanvasCopy = legendCanvas.cloneNode(true);
    
    // // here we clone the original element to create a new DOM node
    // let legendCopy = legend.cloneNode(true);
    // // now take all of the styles from the original node (so we can inline them)
    // const styles = window.getComputedStyle(legend).cssText;

    // // now inline all of the previous element's styles onto the new element
    // // legendCopy.setAttribute('style', styles);
    // legendCopy.style.backgroundColor = 'red';
    // // here we have to create a fake SVG object that we can write to the canvas element. notice we set the inner div to contain the outerHTML of the cloned element we created above
    // var data = `
    //     <svg xmlns="http://www.w3.org/2000/svg" width="${lWidth}" height="${lHeight}">
    //         <foreignObject width="100%" height="100%">
    //             <div xmlns="http://www.w3.org/1999/xhtml">
    //             ${legendCopy.outerHTML}
    //             </div> 
    //         </foreignObject>
    //     </svg>
    // `
    // console.log(legendCopy.outerHTML)

    // var DOMURL = window.URL || window.webkitURL || window;
    // var legendImage = document.querySelector('#legendImage');
    // legendImage.crossOrigin = 'Anonymous'
    // var svg = new Blob([data], {type: 'image/svg+xml'});
    // var url = DOMURL.createObjectURL(svg);
    // legendImage.onload = function() {
    //   // // draw the new image to the canvas
    //   var ctx = legendCanvas.getContext('2d');
    //   ctx.drawImage(legendImage, 0, 0);
    //   DOMURL.revokeObjectURL(url);
    // }
    // legendImage.src = url;
    // console.log(legendImage)
    // var ctx = legendCanvas.getContext('2d');
    window.setTimeout(() => {
      // const legendImgData = legendCanvas.toDataURL();
      // pdf.addImage(legendImgData, 'PNG', 0, 0);
      pdf.save('jchs_map.pdf');
    }, 0)
    
    ///////////////////////////////////

    // pdf.text('JCHS', 10, 10)
    // document.body.removeChild(legendCanvas);
    // document.body.appendChild(legendCanvasCopy);
  }

  handleJSONCTDownload(){
    let url;
    let baseUrl = __DEV__ ? 'http://localhost:3000' : 'https://panettone.herokuapp.com';
    if (this.state.dataType === 'filtered') {
      const config = {
        method: 'POST',
        body: JSON.stringify(window.geojsonFiltered),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    
      fetch(`${baseUrl}/json-dl-filtered`, config).then(res => res.json()).then(json => {
        location.assign(`${baseUrl}/json-dl-filtered`)
      })

    }
    if (this.state.dataType === 'all') {
        window.open(baseUrl + '/json-dl', '_blank');
    } else if (this.state.dataType === 'filtered') {
      // var xhr = new XMLHttpRequest();
      // xhr.open('POST', baseUrl + '/json-dl-filtered', true);
      // xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      // // send the collected data as JSON
      // xhr.send(JSON.stringify(window.geojsonFiltered));
      // console.log(window.geojsonFiltered);
      // xhr.onloadend = function () {
      //   console.log('done');
      // };
    }
  }

  handleJSONMSDownload(){
    console.log('handling JSONMS download');
  }

  handleCSVDownload(){
    let url;
    if (__DEV__) {
      url = 'http://localhost:3000/csv-dl';
    } else {
      url = 'https://panettone.herokuapp.com/csv-dl';
    }
    window.open(url, '_blank');
  }

  render() {
    return (
      <div className="downloadsPane sidebarPane">
        <div className='header'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? (<div className='titleContainer'>
                  <span className='header-title'>Downloads</span>
                 </div>)
              : null
            }
          </VelocityTransitionGroup>
        </div>
        <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration + 50}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration + 50}}
          >
            {this.state.showingPane
              ? this.renderChoices()
              : null
            }
        </VelocityTransitionGroup>
      </div>
    );
  }
  renderChoices(){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.memory));
    return (
      <div>
        <div className='downloadsPane-choices-titleContainer'>
          <span className='downloadsPane-choices-title'>Census Data<span className='fa fa-bar-chart downloadsPane-choices-titleIcon' /></span>
        </div>
        <div className='downloadsPane-choices downloadsPane-choices-censusData'>
          <DownloadsPaneChoice type='json' icon='fa-file-code-o' handleDownload={this.handleJSONCTDownload} />
          <DownloadsPaneChoice type='csv' icon='fa-file-text-o' handleDownload={this.handleCSVDownload} />
        </div>
        <div className='downloadsPane-choices-titleContainer'>
          <span className='downloadsPane-choices-title'>Map<span className='fa fa-map-o downloadsPane-choices-titleIcon' /></span>
        </div>
        <div className='downloadsPane-choices downloadsPane-choices-map'>
          <DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o' handleDownload={this.handlePDFDownload} />
        </div>
        <div className='downloadsPane-choices-titleContainer'>
          <span className='downloadsPane-choices-title'>Map Session<span className='fa fa-sitemap downloadsPane-choices-titleIcon' /></span>
        </div>
        <div className='downloadsPane-choices downloadsPane-choices-mapSession'>
          <a href={dataStr} download='mapSession.json' >
            <DownloadsPaneChoice type='json' icon='fa-file-code-o' handleDownload={this.handleJSONMSDownload} />
          </a>
        </div>
      </div>
    )
  }
}
 export default DownloadsPane;
 
 //<DownloadsPaneChoice type='PNG' icon='fa-file-image-o' handleDownload={this.handlePNGDownload} />

//  <div className='downloadsPane-toggleDataType' id='downloadsPane-toggleDataType'>
//             <div className={'downloadsPane-toggleDataType-choice downloadsPane-toggleDataType-choice1 downloadsPane-toggleDataType-choice-' +
//                             (this.state.dataType === 'all' ? 'active' : 'inactive') }
//                  id={'downloadsPane-toggleDataType-all'}
//                  onClick={this.handleDataTypeClick} >
//               <span className='downloadsPane-toggleDataType-choice-text'>
//                 All
//               </span>
//             </div>
//             <div className={'downloadsPane-toggleDataType-choice downloadsPane-toggleDataType-choice2 downloadsPane-toggleDataType-choice-' +
//                             (this.state.dataType === 'filtered' ? 'active' : 'inactive') }
//                  id={'downloadsPane-toggleDataType-filtered'}
//                  onClick={this.handleDataTypeClick} >
//               <span className='downloadsPane-toggleDataType-choice-text'>
//                 Filtered
//               </span>
//             </div>
//           </div>