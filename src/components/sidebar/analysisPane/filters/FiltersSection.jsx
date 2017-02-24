import './FiltersSection.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import ReactDOM from 'react-dom';
import Filter from './Filter.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';
import { convertPropsMetadataToDrodownObject } from './utils.jsx';

// TMEP DATA
const fakeYears=[
  {value: '1990', label: '1990'},
  {value: '2000', label: '2000'},
  {value: '2010', label: '2010'},
  {value: '2014', label: '2014'}
];

// FILTER MEMORY
var memory = {
  filterSettings: {}
}

class FiltersSection extends React.Component {
  constructor(props){
    super();
    this.fields = convertPropsMetadataToDrodownObject(props.propsMd);
    this.state = {
      filterIds: Object.keys(memory.filterSettings)
    }
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.spinAddFilterButton = this.spinAddFilterButton.bind(this);
    this.updateFilterSettingsMemory = this.updateFilterSettingsMemory.bind(this);
  }
  
  componentDidUpdate(){
  }

  handleAddFilter(){
    var filterIds = this.state.filterIds;
    if (this.state.filterIds.length < 3){
      // ADD A NEW FILTER TO THE STATE'S LIST
      const newFilterId = guid();
      filterIds.push(newFilterId);
      // memory.filterSettings[newFilterId] = defaultFilterSetting;
      this.setState({
        filterIds: filterIds,
        activeFilters: {}
      });
      this.spinAddFilterButton('right');
    }
  }

  handleRemoveFilter(filterId){
    var filterIds = this.state.filterIds;
    filterIds.splice(filterIds.indexOf(filterId), 1);
    delete memory.filterSettings[filterId];
    this.setState({
      filterIds: filterIds
    });
    this.spinAddFilterButton('left');
  }

  spinAddFilterButton(dir){
    let incrementNum
    if (dir === 'right'){
      incrementNum = 90;
    } else if (dir === 'left') {
      incrementNum = -90;
    }
    // ROTATE THE ADD FILTER BUTTON  
    const currentRotationCSS = this.refs.faPlusRotator.style.transform;
    if (currentRotationCSS === ''){
      this.refs.faPlusRotator.style.transform = 'rotateZ(90deg)'
    } else {
      const currentRotation = parseInt(currentRotationCSS.split('(')[1].slice(0,-1));
      this.refs.faPlusRotator.style.transform = `rotateZ(${currentRotation + incrementNum}deg)`;
    }
  }

  updateFilterSettingsMemory(filterId, filterState){
    memory.filterSettings[filterId] = filterState;
    console.log('UPDATED MEMORY:', memory);
  }

  render() {
    return (
      <div className="filtersSection section">
        <div className='header'>
          <span className='header-title'>
            Filters<span className='fa fa-filter'/>
            <div className={'addFilterButton addFilterButton-' + (this.state.filterIds.length < 3 ? 'active' : 'inactive')} onClick={this.handleAddFilter}>
              <div className='faPlusRotator' ref='faPlusRotator'>
                <span className='fa fa-plus'/>
              </div>
            </div>
          </span>
        </div>
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.filterIds)}
          {this.state.filterIds.length === 0
            ? <div className='noFiltersMessage-container'><span className='noFiltersMessage'>No Filters Active</span></div>
            : null
          }
        </div>
      </div>
    );
  }

  renderFilterNodes(filterIds){
    const filterNodes = filterIds.map((filterId, i) => {
      // eventually once debugging is completed, renderOrder should be used to be the placeholder for the filter titles
      const renderOrder = i + 1
      console.log("RENDERING: ", filterId);
      console.log(memory.filterSettings[filterId])
      return(
        <Filter key={filterId} id={filterId} memory={memory.filterSettings[filterId]} fields={this.fields} handleRemoveFilter={this.handleRemoveFilter} updateFilterSettingsMemory={this.updateFilterSettingsMemory} renderOrder={renderOrder} propsMd={this.props.propsMd} />
      )
    });
    return filterNodes;
  }
}

 export default FiltersSection;

 //data-tip='Add A Filter' data-for='addFilterTooltip'
 //<ReactTooltip id='addFilterTooltip' type='dark' place='right' effect='solid' className='addFilterTooltip' offset="{'right': 5}"/>
