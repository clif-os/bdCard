import './FiltersSection.styl';
import React from 'react';
// import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import Filter from './Filter.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { constructFilterEventData, filterEventsAreDifferent } from './filterUtils.jsx';
import { convertPropsMetadataToDrodownObject, mergeAllActiveFields } from '../analysisUtils.jsx';

import {VelocityTransitionGroup} from 'velocity-react';

// FILTER MEMORY
var memory = {
  filterSettings: {},
  lastFilterEventData: null
};

class FiltersSection extends React.Component {
  constructor(props) {
    super();
    this.dropdownData = Object.assign({}, convertPropsMetadataToDrodownObject(props.propsMd));
    this.state = {
      filterIds: Object.keys(memory.filterSettings),
      showingPane: false,
      showTips: false
    }
    this.handleAddFilter = this
      .handleAddFilter
      .bind(this);
    this.handleRemoveFilter = this
      .handleRemoveFilter
      .bind(this);
    this.spinAddFilterButton = this
      .spinAddFilterButton
      .bind(this);
    this.updateFilterSettingsMemory = this
      .updateFilterSettingsMemory
      .bind(this);
  }

  componentDidMount() {
    this.setState({showingPane: true});
    window.setTimeout(() => {
      this.setState({showTips: true})
    }, this.props.transitionDuration)
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
            : null
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