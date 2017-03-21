import './MapsPane.styl';
import React from 'react';
import {VelocityTransitionGroup} from 'velocity-react';
import MapChoice from './MapChoice.jsx';
import UploadMapButton from './UploadMapButton.jsx';
import SavedMapChoice from './SavedMapChoice.jsx'

var memoryIndex = 1
var uploadedMemoryIndex = 1

class MapsPane extends React.Component {
  constructor(props) {
    super();

    this.state = {
      showingPane: false,
      savedMapMemories: props.savedMapMemories,
      uploading: false
    }
    this.handleMapMemoryChoice = this
      .handleMapMemoryChoice
      .bind(this);
    this.saveMap = this
      .saveMap
      .bind(this);
    this.handleDeleteSavedMemory = this
      .handleDeleteSavedMemory
      .bind(this);
  }

  componentDidMount() {
    this.setState({showingPane: true});
  }

  handleMapMemoryChoice(choice) {
    this
      .props
      .handleMapMemoryChoice(choice.memory);
  }

  handleDeleteSavedMemory(index) {
    var newMapMemories = [...this.state.savedMapMemories];
    newMapMemories.splice(index, 1);
    this.setState({savedMapMemories: newMapMemories});
    this
      .props
      .setSavedMemories(newMapMemories);
  }

  saveMap(memory) {
    let mapMemory;
    if (memory === undefined) {
      mapMemory = {
        memory: this.props.memory,
        title: 'Saved Map ' + memoryIndex,
        icon: 'fa-bookmark-o'
      }
      memoryIndex++;
    } else {
      mapMemory = {
        memory: memory,
        title: 'Upload Map ' + uploadedMemoryIndex,
        icon: 'fa-upload'
      }
      uploadedMemoryIndex++;
    }
    var newMapMemories = [...this.state.savedMapMemories];
    newMapMemories.push(mapMemory);
    this.setState({savedMapMemories: newMapMemories});
    this
      .props
      .setSavedMemories(newMapMemories);
  };

  render() {
    return (
      <div className="mapsPane sidebarPane">
        <div className='header'>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{
            animation: "transition.slideLeftIn",
            duration: this.props.transitionDuration
          }}
            leave={{
            animation: "transition.slideLeftOut",
            duration: this.props.transitionDuration
          }}>
            {this.state.showingPane
              ? (
                <div className='titleContainer'>
                  <span className='header-title'>Maps</span>
                </div>
              )
              : null
}
          </VelocityTransitionGroup>
        </div>
        <VelocityTransitionGroup
          className='velocityTransitionGroup'
          enter={{
          animation: "transition.slideLeftIn",
          duration: this.props.transitionDuration + 50
        }}
          leave={{
          animation: "transition.slideLeftOut",
          duration: this.props.transitionDuration + 50
        }}>
          {this.state.showingPane
            ? this.renderChoices(this.props.mapMemories, this.state.savedMapMemories)
            : null
}
        </VelocityTransitionGroup>
      </div>
    );
  }
  renderChoices(recommendedChoices, savedChoices) {
    const recommendedNodes = recommendedChoices.map((choice, i) => {
      const order = i + 1;
      return <MapChoice
        key={i}
        title={choice.title}
        icon={choice.icon}
        choice={choice}
        order={order}
        type='load'
        rows={Math.ceil(recommendedChoices.length / 2)}
        handleMapMemoryChoice={this.handleMapMemoryChoice}/>
    });
    const savedNodes = savedChoices.map((choice, i) => {
      const order = i + 1;
      return <SavedMapChoice
        key={i}
        title={choice.title}
        icon={choice.icon}
        choice={choice}
        order={order}
        type='load'
        rows={Math.ceil(savedChoices.length / 2)}
        handleMapMemoryChoice={this.handleMapMemoryChoice}
        handleDeleteSavedMemory={this.handleDeleteSavedMemory}/>
    });
    return (
      <div>
        <div className='mapsPane-choices-titleContainer'>
          <span className='mapsPane-choices-title'>Recommended Maps<span className='fa fa-star-o mapsPane-choices-titleIcon'/></span>
        </div>
        <div className='mapsPane-choices'>
          {recommendedNodes}
        </div>
        <div className='mapsPane-choices-titleContainer'>
          <span className='mapsPane-choices-title'>User-selected Maps<span className='fa fa-user-o mapsPane-choices-titleIcon'/></span>
        </div>
        <div className='mapsPane-choices'>
          {savedNodes}
        </div>
        <div className='mapsPane-choices mapsPane-choices-controls'>
          <MapChoice
            title='Save Map'
            icon='fa-save'
            order={1}
            type='control'
            handleMapMemoryChoice={this.saveMap}/>
          <UploadMapButton
            title='Upload Map'
            icon='fa-upload'
            order={2}
            type='control'
            saveMap={this.saveMap} />
        </div>
      </div>
    )
  }
}
export default MapsPane;

// {/*<DownloadsPaneChoice type='pdf' icon='fa-file-pdf-o'
// handleDownload={this.handlePDFDownload} />*/}