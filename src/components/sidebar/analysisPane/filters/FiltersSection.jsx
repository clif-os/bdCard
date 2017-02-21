import './FiltersSection.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import Filter from './Filter.jsx';
import { guid } from '../../../../utils/generalUtils.jsx';

// TEMP DATA
const fakeFields= [];
for (var i = 1; i < 52; i++){
  fakeFields.push({value: 'longoptionnameasuh-' + i, label: 'Long Option Name Asuh ' + i});
}
const fakeYears=[
  {value: '1990', label: '1990'},
  {value: '2000', label: '2000'},
  {value: '2010', label: '2010'},
  {value: '2014', label: '2014'}
];

// COMPONENT MEMORY
const memory = {
  filterIds: []
}

class FiltersSection extends React.Component {
  constructor(props){
    super();
    this.state = {
      activeFilterIds: memory.filterIds
    }
    this.handleAddFilter = this.handleAddFilter.bind(this);
    this.handleRemoveFilter = this.handleRemoveFilter.bind(this);
    this.spinAddFilterButton = this.spinAddFilterButton.bind(this);
  }
  
  componentDidUpdate(){
    memory.filterIds = this.state.activeFilterIds;
  }

  handleAddFilter(){
    var activeFilterIds = this.state.activeFilterIds;
    if (this.state.activeFilterIds.length < 3){
      // ADD A NEW FILTER TO THE STATE'S LIST
      const newFilterId = guid();
      activeFilterIds.push(newFilterId);
      this.setState({
        activeFilterIds: activeFilterIds
      });
      this.spinAddFilterButton('right');
    }
  }

  handleRemoveFilter(filterId){
    var activeFilterIds = this.state.activeFilterIds;
    activeFilterIds.splice(activeFilterIds.indexOf(filterId), 1);
    this.setState({
      activeFilterIds: activeFilterIds
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

  render() {
    return (
      <div className="filtersSection section">
        <div className='header'>
          <span className='header-title'>
            Filters<span className='fa fa-filter'/>
            <div className={'addFilterButton addFilterButton-' + (this.state.activeFilterIds.length < 3 ? 'active' : 'inactive')} onClick={this.handleAddFilter}>
              <div className='faPlusRotator' ref='faPlusRotator'>
                <span className='fa fa-plus'/>
              </div>
            </div>
          </span>
        </div>
        <div className='filtersContainer'>
          {this.renderFilterNodes(this.state.activeFilterIds)}
        </div>
      </div>
    );
  }

  renderFilterNodes(filterIds){
    const filterNodes = filterIds.map((filterId, i) => {
      return(
        <Filter key={i} id={filterId} fields={fakeFields} years={fakeYears} handleRemoveFilter={this.handleRemoveFilter} />
      )
    });
    return filterNodes;
  }
}

 export default FiltersSection;

 //data-tip='Add A Filter' data-for='addFilterTooltip'
 //<ReactTooltip id='addFilterTooltip' type='dark' place='right' effect='solid' className='addFilterTooltip' offset="{'right': 5}"/>