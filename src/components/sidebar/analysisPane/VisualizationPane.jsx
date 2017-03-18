import './VisualizationPane.styl';
import 'react-select/dist/react-select.css';
import React from 'react';
import VisualizeClassesSection from './visualization/VisualizeClassesSection.jsx';
import VisualizePassFailSection from './visualization/VisualizePassFailSection.jsx';
import { VelocityTransitionGroup } from 'velocity-react';

var memory = {
  // visualizerChoice: 'classes',
  // classes:{

  // },
  // passFail: {

  // }
}

class VisualizationPane extends React.Component {
  constructor(props){
    super();
    memory = props.memory;
    this.state = {
      showingPane: false,
      visualizerChoice: props.memory.visualizerChoice,
      visualizerSwitch: false
    }
    this.handleVisualizerChoice = this.handleVisualizerChoice.bind(this);
    this.updateVisualizersMemory = this.updateVisualizersMemory.bind(this);
  }

  componentDidMount(){
    this.setState({
      showingPane: true
    });
  }

  updateVisualizersMemory(componentName, componentMemory){
    memory[componentName] = componentMemory;
    this.props.updateMasterMemory('visualizers', memory);
  }

  handleVisualizerChoice(e){
    const choice = e.target.id.split('-')[1];
    if (this.state.visualizerChoice !== choice){
      this.setState({
        visualizerChoice: choice,
        visualizerSwitch: true
      });
      memory.visualizerChoice = choice;
      this.props.updateMasterMemory('visualizers', memory);
    }
  };

  render() {
    return (
      <div className="visualizationPane sidebarPane">
        <div className='header'>
          <div className='titleContainer'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideLeftIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideLeftOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? (<span className='header-title'>Visualization Settings</span>)
              : null
            }
          </VelocityTransitionGroup>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{animation: "transition.slideRightIn", duration: this.props.transitionDuration}}
            leave={{animation: "transition.slideRightOut", duration: this.props.transitionDuration}}
          >
            {this.state.showingPane
              ? (<div className='visualizerChoiceButtons'>
                    <div id='visChoice-passFail' onClick={this.handleVisualizerChoice} className={'visualizerChoiceButton visualizerChoiceButton-' + (this.state.visualizerChoice === 'passFail' ? 'active' : 'inactive')}>Pass/Fail</div>
                    <div id='visChoice-classes' onClick={this.handleVisualizerChoice} className={'visualizerChoiceButton visualizerChoiceButton-' + (this.state.visualizerChoice === 'classes' ? 'active' : 'inactive')}>Classes</div>
                  </div>)
              : null
            }
          </VelocityTransitionGroup>
          </div>
        </div>
        {this.renderVisualizer(this.state.visualizerChoice)}
      </div>
    );
  }
  renderVisualizer(choice){
    if (choice === 'classes'){
      return <VisualizeClassesSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} visualizerSwitch={this.state.visualizerSwitch} memory={this.props.memory.classes} updateVisualizersMemory={this.updateVisualizersMemory} />
    } else if (choice === 'passFail') {
      return <VisualizePassFailSection propsMd={this.props.propsMd} transitionDuration={this.props.transitionDuration} visualizerSwitch={this.state.visualizerSwitch} memory={this.props.memory.passFail} updateVisualizersMemory={this.updateVisualizersMemory} />
    }
  }
}
 export default VisualizationPane;

 //<VisualizationSection propsMd={this.props.propsMd} />