import './FiltersSection.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import Filter from './Filter.jsx';

const fakeFieldList=['option 1','option 2','option 3','option 4','option 2','option 3','option 4','option 2','option 3','option 4','option 2','option 3','option 4','option 2','option 3','option 4'];
const fakeYearList=['1990','2000','2010','2014'];

class FiltersSection extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="filtersSection section">
        <div className='header'>
          <span className='header-title'>
            Filters<span className='fa fa-filter'/>
            <div className='addFilterButton' data-tip='Add A Filter' data-for='addFilterTooltip'>
              <span className='fa fa-plus'/>
              <ReactTooltip id='addFilterTooltip' type='dark' place='right' effect='solid' className='addFilterTooltip' offset="{'right': 5}"/>
            </div>
          </span>
        </div>
        <div className='filtersContainer'>
          <Filter id={1} fields={fakeFieldList} years={fakeYearList} />
          <Filter id={2} fields={fakeFieldList} years={fakeYearList} />
          <Filter id={3} fields={fakeFieldList} years={fakeYearList} />
        </div>
      </div>
    );
  }
}

 export default FiltersSection;