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
    this.handleJSONMSDownload = this.handleJSONMSDownload.bind(this);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    })
  }

  handleJSONCTDownload(){
    let url;
    if (__DEV__) {
      url = 'http://localhost:3000/json-dl';
    } else {
      url = 'https://panettone.herokuapp.com/json-dl';
    }
    window.open(url, '_blank');
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
          <span className='downloadsPane-choices-title'>Map Session<span className='fa fa-map-o downloadsPane-choices-titleIcon' /></span>
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

// {/*<DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o' handleDownload={this.handlePDFDownload} />*/}