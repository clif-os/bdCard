import './MapsPane.styl';
import React from 'react';
import { VelocityTransitionGroup } from 'velocity-react';
import MapChoice from './MapChoice.jsx';

class MapsPane extends React.Component {
  constructor(props){
    super();
    this.state = {
      showingPane: false
      
    }
    this.handleMapMemoryChoice = this.handleMapMemoryChoice.bind(this);
  }

  handleMapMemoryChoice(choice){
    this.props.handleMapMemoryChoice(choice.memory);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    })
  }

  render() {
    return (
      <div className="mapsPane sidebarPane">
        <div className='header'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? (<div className='titleContainer'>
                  <span className='header-title'>Maps</span>
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
              ? this.renderChoices(this.props.mapMemories)
              : null
            }
        </VelocityTransitionGroup>
      </div>
    );
  }
  renderChoices(choices){
    const nodes = choices.map((choice, i) => {
      return <MapChoice key={i} title={choice.title} icon={choice.icon} 
                        loadMap={this.load} choice={choice} 
                        handleMapMemoryChoice={this.handleMapMemoryChoice} />
    })
    return (
      <div className='mapsPane-choices'>
        {nodes}
      </div>
    )
  }
}
 export default MapsPane;

// {/*<DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o' handleDownload={this.handlePDFDownload} />*/}