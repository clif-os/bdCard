import './DownloadsPane.styl';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import DownloadsPaneChoice from './DownloadsPaneChoice.jsx';

class DownloadsPane extends React.Component {
  constructor(props){
    super();
    this.state = {
      showingPane: false
      
    }
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    })
  }

  handleJSONDownload(){
    console.log('handling json dowload lmao')
  }

  handleCSVDownload(){
    console.log('handling csv dowload lmao')
  }

  handlePDFDownload(){
    console.log('handling pdf dowload lmao')
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

    return (
      <div className='downloadsPane-choices'>
        <DownloadsPaneChoice type='json' icon='fa-file-code-o' handleDownload={this.handleJSONDownload} />
        <DownloadsPaneChoice type='csv' icon='fa-file-text-o' handleDownload={this.handleCSVDownload} />
        <DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o' handleDownload={this.handlePDFDownload} />
      </div>
    )
  }
}
 export default DownloadsPane;

//  {/*<div className='downloadsPane-choices-json downloadsPane-choice' onClick={this.handleJSONDownload}>
//           <span className='downloadsPane-choice-title'><span className='downloadsPane-choice-icon fa fa-file-code-o' />JSON</span>
//         </div>
//         <div className='downloadsPane-choices-csv downloadsPane-choice' onClick={this.handleCSVDownload}>
//           <span className='downloadsPane-choice-title'><span className='downloadsPane-choice-icon fa fa-file-text-o' />CSV</span>
//         </div>
//         <div className='downloadsPane-choices-pdf downloadsPane-choice' onClick={this.handlePDFDownload}>
//           <span className='downloadsPane-choice-title'><span className='downloadsPane-choice-icon fa fa-file-pdf-o' />PDF</span>
//         </div>*/}