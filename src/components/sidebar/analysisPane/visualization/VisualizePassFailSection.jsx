import './VisualizePassFailSection.styl';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import PassFailVisualizer from './PassFailVisualizer.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { constructVisPassFailEventData, visPassFailEventsAreDifferent } from './visUtils.jsx';
import { convertPropsMetadataToDrodownObject, updateActiveFields } from '../analysisUtils.jsx';

// FILTER MEMORY
var memory = {
  // filterSettings: {},
  // lastFilterEventData: null
};

class VisualizePassFailSection extends React.Component {
  constructor(props) {
    super();
    memory = props.memory;
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    if (Object.keys(memory.filterSettings).length > 0){
      this.state = {
        filterIds: Object.keys(memory.filterSettings),
        resetClicked: false,
        showingPane: false
      }
    } else {
      this.state = {
        filterIds: [guid(), guid()],
        resetClicked: false,
        showingPane: false
      }
    }
    this.updateFilterSettingsMemory = this.updateFilterSettingsMemory.bind(this);
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidMount(){
    var style = document.getElementById("visPassFailControls").style;
    style.right = '0px';
    if (this.props.visualizerSwitch){
      const visEventData = constructVisPassFailEventData(memory.filterSettings);
      const visualize = new CustomEvent('VISUALIZE_PASSFAIL', {'detail': visEventData});
      document.dispatchEvent(visualize);
    }
  }

  updateFilterSettingsMemory(filterId, filterState) {
    memory.filterSettings[filterId] = filterState;
    updateActiveFields('passFail', memory.filterSettings);
    if (!filterState.freezeValidity) {
      this.determineVisEventFire();
    }
    this.props.updateVisualizersMemory('passFail', memory);
  }

  determineVisEventFire() {
    const visEventData = constructVisPassFailEventData(memory.filterSettings);
    if (memory.lastVisEventData !== null) {
      if (visPassFailEventsAreDifferent(memory.lastVisEventData, visEventData)) {
        let evt;
        evt = new CustomEvent('VISUALIZE_PASSFAIL', {'detail': visEventData});
        document.dispatchEvent(evt);
        const deselect = new CustomEvent('DESELECT_FEATURE');
        document.dispatchEvent(deselect);
      }
    }
    memory.lastVisEventData = visEventData;
  }

  handleReset(){
    if (this.state.resetClicked === false){
      const filterIds = Object.keys(memory.filterSettings)
      filterIds.forEach(filterId => {
        const range = [...memory.filterSettings[filterId].range];
        memory.filterSettings[filterId].selectedRange = [...range];
        memory.filterSettings[filterId].filterValid = false;
      });
      this.setState({
        filterIds: filterIds,
        resetClicked: true
      });
      window.setTimeout(() => {
        this.setState({
          resetClicked: false
        });
      }, 500);
    }
  }

  render() {
    return (
      <div className="visualizePassFailSection section">
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.filterIds)}
          <div className="visPassFailControls" id="visPassFailControls"> 
            <div className={"visPassFailControls-resetButton visPassFailControls-resetButton-" + (this.state.resetClicked ? 'clicked' : 'notClicked')} 
                 onClick={this.handleReset}>
              <span className="visPassFailControls-resetButton-text"><span className="fa fa-rotate-left visPassFailControls-resetButton-icon" />Reset</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderFilterNodes(filterIds) {
    //// this process ends up loading a defaultFieldIndex into the nodes so that duplicate fields aren't defaulted
    let fieldLabels;
    if (Object.keys(memory.filterSettings).length > 0){
      fieldLabels = filterIds.reduce((acc, filterId) => {
        if (memory.filterSettings[filterId] !== undefined){
          acc.push(memory.filterSettings[filterId].fieldLabel);
        };
        return acc;
      }, []);
    };
    let unselectedIndexes;
    unselectedIndexes = this.dropdownData.fieldDropdowns.reduce((acc, fieldDropdown, i) => {
      if (fieldLabels === undefined){
        acc.push(i);
        return acc;
      }
      if (fieldLabels.indexOf(fieldDropdown.label) > -1){
        return acc;
      } else {
        acc.push(i);
        return acc;
      }
    }, []);
    ////
    const filterNodes = filterIds.map((filterId, i) => {
      const renderOrder = i + 1;
      let defaultFieldIndex = unselectedIndexes[i];
      return (<PassFailVisualizer
        key={filterId}
        id={filterId}
        memory={memory.filterSettings[filterId]}
        defaultFieldIndex={defaultFieldIndex}
        dropdownData={this.dropdownData}
        handleRemoveFilter={this.handleRemoveFilter}
        updateFilterSettingsMemory={this.updateFilterSettingsMemory}
        renderOrder={renderOrder}
        propsMd={this.props.propsMd}/>)
    });
    return filterNodes;
  }
}

export default VisualizePassFailSection;

// data-tip='Add A Filter' data-for='addFilterTooltip' <ReactTooltip
// id='addFilterTooltip' type='dark' place='right' effect='solid'
// className='addFilterTooltip' offset="{'right': 5}"/>