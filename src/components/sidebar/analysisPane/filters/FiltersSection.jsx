import './FiltersSection.styl';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import Filter from './Filter.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { constructFilterEventData, filterEventsAreDifferent } from './filterUtils.jsx';
import { convertPropsMetadataToDrodownObject, updateActiveFields } from '../analysisUtils.jsx';

import {VelocityTransitionGroup} from 'velocity-react';

// FILTER MEMORY
var memory = {
  // filterSettings: {},
  // lastFilterEventData: null
};

class FiltersSection extends React.Component {
  constructor(props) {
    super();
    memory = props.memory;
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    this.state = {
      filterIds: Object.keys(memory.filterSettings),
      showingPane: false,
      showTips: false,
      resetClicked: false,
      deleteClicked: false
    }
    this.handleAddFilter = this
      .handleAddFilter
      .bind(this);
    this.handleRemoveFilter = this
      .handleRemoveFilter
      .bind(this);
    this.handleRemoveAllFilters = this.handleRemoveAllFilters.bind(this);
    this.spinAddFilterButton = this
      .spinAddFilterButton
      .bind(this);
    this.updateFilterSettingsMemory = this
      .updateFilterSettingsMemory
      .bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  componentDidMount() {
    if (document.getElementById("filtersControls") !== null){
      var style = document.getElementById("filtersControls").style;
      style.right = '0px';
    }
    this.setState({showingPane: true});
    window.setTimeout(() => {
      this.setState({showTips: true})
    }, this.props.transitionDuration)
  }

  componentDidUpdate(){
    if (document.getElementById("filtersControls") !== null){
      var style = document.getElementById("filtersControls").style;
      style.right = '0px';
    }
  }

  handleAddFilter() {
    var filterIds = this.state.filterIds;
    if (this.state.filterIds.length < 3) {
      // ADD A NEW FILTER TO THE STATE'S LIST
      const newFilterId = guid();
      filterIds.push(newFilterId);
      // memory.filterSettings[newFilterId] = defaultFilterSetting;
      this.setState({filterIds: filterIds});
      this.spinAddFilterButton('right');
    }
    updateActiveFields('filter', memory.filterSettings);
  }

  handleRemoveFilter(filterId) {
    var filterIds = [...this.state.filterIds];
    filterIds.splice(filterIds.indexOf(filterId), 1);
    // if the removed filter is available in the lastFilterEventData -- it should be
    // removed and filter event should be pushed through
    delete memory.filterSettings[filterId];
    this.determineFilterEventFire();
    this.setState({filterIds: filterIds});
    this.spinAddFilterButton('left');
    updateActiveFields('filter', memory.filterSettings);
    // RESET THE FILTER PANE CONTROLS BACK IN QUEU FOR ANIMATION
    if (Object.keys(memory.filterSettings).length === 0){
      var style = document.getElementById("filtersControls").style;
      style.right = '100%';
    }
  }

  handleRemoveAllFilters(){
    memory.filterSettings = {};
    this.determineFilterEventFire();
    this.setState({
      filterIds: [],
      deleteClicked: true
    });
    this.spinAddFilterButton('left');
    updateActiveFields('filter', memory.filterSettings);
    if (Object.keys(memory.filterSettings).length === 0){
      var style = document.getElementById("filtersControls").style;
      style.right = '100%';
    }
    window.setTimeout(() => {
        this.setState({
          deleteClicked: false
        });
      }, 500);
  }

  updateFilterSettingsMemory(filterId, filterState) {
    memory.filterSettings[filterId] = filterState;
    updateActiveFields('filter', memory.filterSettings);
    if (!filterState.freezeFilterValidity) {
      this.determineFilterEventFire();
    }
    this.props.updateMasterMemory('filters', memory);
  }

  determineFilterEventFire() {
    const filterEventData = constructFilterEventData(memory.filterSettings);
    if (memory.lastFilterEventData !== null) {
      if (filterEventsAreDifferent(memory.lastFilterEventData, filterEventData)) {
        const evt = new CustomEvent('FILTER', {'detail': filterEventData})
        document.dispatchEvent(evt);
        const deselect = new CustomEvent('DESELECT_FEATURE');
        document.dispatchEvent(deselect);
        this.props.handleCountUpdate('filter', filterEventData.length);
      }
    }
    memory.lastFilterEventData = filterEventData;
  }

  spinAddFilterButton(dir) {
    let incrementNum
    if (dir === 'right') {
      incrementNum = 90;
    } else if (dir === 'left') {
      incrementNum = -90;
    }
    // ROTATE THE ADD FILTER BUTTON
    const currentRotationCSS = this.refs.faPlusRotator.style.transform;
    if (currentRotationCSS === '') {
      this.refs.faPlusRotator.style.transform = 'rotateZ(90deg)'
    } else {
      const currentRotation = parseInt(currentRotationCSS.split('(')[1].slice(0, -1));
      this.refs.faPlusRotator.style.transform = `rotateZ(${currentRotation + incrementNum}deg)`;
    }
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
      <div className="filtersSection section">
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
              ? <span className='header-title'>Filter Settings</span>
              : null
}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{
            animation: "transition.slideRightIn",
            duration: this.props.transitionDuration
          }}
            leave={{
            animation: "transition.slideRightOut",
            duration: this.props.transitionDuration
          }}>
            {this.state.showingPane
              ? (
                <div
                  className={'addFilterButton addFilterButton-' + (this.state.filterIds.length < 3
                  ? 'active'
                  : 'inactive')}
                  onClick={this.handleAddFilter}>
                  <div className='faPlusRotator' ref='faPlusRotator'>
                    <span className='fa fa-plus'/>
                  </div>
                </div>
              )
              : null
}
          </VelocityTransitionGroup>
          <VelocityTransitionGroup
            className='velocityTransitionGroup'
            enter={{
            animation: "transition.slideRightIn",
            duration: this.props.transitionDuration
          }}
            leave={{
            animation: "transition.slideRightOut",
            duration: this.props.transitionDuration
          }}>
            {this.state.showTips && (this.state.filterIds.length < 3)
              ? <span className='addFilterMessage'>Add A Filter</span>
              : null
}
          </VelocityTransitionGroup>
        </div>
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.filterIds)}
          {this.state.filterIds.length === 0
            ? <div className='noFiltersMessage-container'>
                <span className='noFiltersMessage'>No Filters Active</span>
              </div>
            : (
              <div className="filtersControls" id="filtersControls"> 
                <div className={"filtersControls-resetButton filtersControls-resetButton-" + (this.state.resetClicked ? 'clicked' : 'notClicked')} 
                    onClick={this.handleReset}>
                  <span className="filtersControls-resetButton-text"><span className="fa fa-rotate-left filtersControls-resetButton-icon" />Reset All</span>
                </div>
                {this.state.filterIds.length > 1
                  ? (
                      <div className={"filtersControls-deleteButton filtersControls-deleteButton-" + (this.state.deleteClicked ? 'clicked' : 'notClicked')} 
                           onClick={this.handleRemoveAllFilters}>
                        <span className="filtersControls-deleteButton-text"><span className="fa fa-trash filtersControls-deleteButton-icon" />Delete All</span>
                      </div>
                    )
                  : null
                }
              </div>
              )
          }
          
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
      return (<Filter
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

export default FiltersSection;

// data-tip='Add A Filter' data-for='addFilterTooltip' <ReactTooltip
// id='addFilterTooltip' type='dark' place='right' effect='solid'
// className='addFilterTooltip' offset="{'right': 5}"/>