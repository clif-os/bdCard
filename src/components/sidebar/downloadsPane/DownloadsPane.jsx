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
    let url;
    if (__DEV__) {
      url = 'http://localhost:3000/json-dl';
    } else {
      url = 'https://panettone.herokuapp.com/json-dl';
    }
    window.open(url, '_blank');
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

    return (
      <div className='downloadsPane-choices'>
        <DownloadsPaneChoice type='json' icon='fa-file-code-o' handleDownload={this.handleJSONDownload} />
        <DownloadsPaneChoice type='csv' icon='fa-file-text-o' handleDownload={this.handleCSVDownload} />
      </div>
    )
  }
}
 export default DownloadsPane;

// {/*<DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o' handleDownload={this.handlePDFDownload} />*/}