import './VisualizationPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import VisualizeClassesSection from './visualization/VisualizeClassesSection.jsx';
import VisualizePassFailSection from './visualization/VisualizePassFailSection.jsx';
import { VelocityTransitionGroup } from 'velocity-react';

var memory = {
  visualizerChoice: 'classes'
}

class VisualizationPane extends React.Component {
  constructor(props){
    super();
    this.state = {
      showingPane: false,
      visualizerChoice: memory.visualizerChoice,
      visualizerSwitch: false
    }
    this.handleVisualizerChoice = this.handleVisualizerChoice.bind(this);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    })
  }

  handleVisualizerChoice(e){
    const choice = e.target.id.split('-')[1];
    if (this.state.visualizerChoice !== choice){
      this.setState({
        visualizerChoice: choice,
        visualizerSwitch: true
      });
      memory.visualizerChoice = choice;
    }
  };

  render() {
    return (
      <div className="visualizationPane sidebarPane">
        <div className='header'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? (<div className='titleContainer'>
                  <span className='header-title'>Visualization Settings</span>
                  <div className='visualizerChoiceButtons'>
                      <div id='visChoice-passFail' onClick={this.handleVisualizerChoice} className={'visualizerChoiceButton visualizerChoiceButton-' + (this.state.visualizerChoice === 'passFail' ? 'active' : 'inactive')}>Pass/Fail</div>
                      <div id='visChoice-classes' onClick={this.handleVisualizerChoice} className={'visualizerChoiceButton visualizerChoiceButton-' + (this.state.visualizerChoice === 'classes' ? 'active' : 'inactive')}>Classes</div>
                  </div>
                 </div>)
              : null
            }
          </VelocityTransitionGroup>
        </div>
        {this.renderVisualizer(this.state.visualizerChoice)}
      </div>
    );
  }
  renderVisualizer(choice){
    if (choice === 'classes'){
      return <VisualizeClassesSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} visualizerSwitch={this.state.visualizerSwitch}/> 
    } else if (choice === 'passFail') {
      return <VisualizePassFailSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} visualizerSwitch={this.state.visualizerSwitch}/>
    }
  }
}
 export default VisualizationPane;

 //<VisualizationSection propsMd={this.props.propsMd} />