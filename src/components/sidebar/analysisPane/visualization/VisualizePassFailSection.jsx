import './VisualizePassFailSection.styl';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import PassFailVisualizer from './PassFailVisualizer.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { constructVisPassFailEventData, visPassFailEventsAreDifferent } from './visUtils.jsx';
import { convertPropsMetadataToDrodownObject, mergeAllActiveFields } from '../analysisUtils.jsx';

import {VelocityTransitionGroup} from 'velocity-react';

// FILTER MEMORY
var memory = {
  filterSettings: {},
  lastFilterEventData: null,
  lastValidFilterEventData: null,
  unvisualized: false
};

class VisualizePassFailSection extends React.Component {
  constructor(props) {
    super();
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    if (Object.keys(memory.filterSettings).length > 0){
      this.state = {
        filterIds: Object.keys(memory.filterSettings),
        showingPane: false
      }
    } else {
      this.state = {
        filterIds: [guid(), guid()],
        showingPane: false
      }
    }
    this.updateFilterSettingsMemory = this
      .updateFilterSettingsMemory
      .bind(this);
    this.areSettingsInactive = this.areSettingsInactive.bind(this);
  }

  componentDidMount(){
    if (this.props.visualizerSwitch){
      console.log('visualizerSwitch = true and mounting')
      if (this.areSettingsInactive(memory.filterSettings)){
        const unvisualize = new CustomEvent('UNVISUALIZE')
        document.dispatchEvent(unvisualize);
        memory.unvisualized = true
      } else {
        const visEventData = constructVisPassFailEventData(memory.filterSettings);
        const visualize = new CustomEvent('VISUALIZE_PASSFAIL', {'detail': visEventData});
        document.dispatchEvent(visualize);
      }
    }
  }

  buildPropLabel(setting){
    if (Object.keys(setting).length === 0){
      return null;
    }
    const fieldLabel = setting.fieldLabel;
    const yearLabel = setting.yearLabel;
    return fieldLabel + ' ' + yearLabel;
    const selectedProp = setting.selectedProp;
  };

  updateActiveFields(settings) {
    window.activeFiltFields = {};
    Object.keys(settings).forEach(settingId => {
      const setting = settings[settingId];
      const propLabel = this.buildPropLabel(setting);
      const selectedProp = setting.selectedProp;
      window.activeFiltFields[selectedProp] = propLabel;
    });
    mergeAllActiveFields();
  };

  updateFilterSettingsMemory(filterId, filterState) {
    memory.filterSettings[filterId] = filterState;
    this.updateActiveFields(memory.filterSettings);
    if (!filterState.freezeFilterValidity) {
      this.determineFilterEventFire();
    }
  }

  areSettingsInactive(settings){
    var inactive = true;
    this.state.filterIds.forEach(filterId => {
      if (settings[filterId] !== undefined){
        if (settings[filterId].filterActive){
          inactive = false;
        }
      }
    });
    return inactive;
  }

  determineFilterEventFire() {
    const filterEventData = constructVisPassFailEventData(memory.filterSettings);
    console.log(memory.lastFilterEventData);
    if (this.areSettingsInactive(memory.filterSettings)){
      const unvisualize = new CustomEvent('UNVISUALIZE');
      document.dispatchEvent(unvisualize);
      memory.unvisualized = true
    } else if (memory.lastFilterEventData !== null) {
      if (memory.unvisualized || visPassFailEventsAreDifferent(memory.lastFilterEventData, filterEventData)) {
        let evt;
        evt = new CustomEvent('VISUALIZE_PASSFAIL', {'detail': filterEventData});
        memory.lastValidFilterEventData = filterEventData;
        document.dispatchEvent(evt);
        const deselect = new CustomEvent('DESELECT_FEATURE');
        document.dispatchEvent(deselect);
        memory.unvisualized = false
      }
    }
    memory.lastFilterEventData = filterEventData;
  }

  render() {
    return (
      <div className="visualizePassFailSection section">
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.filterIds)}
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