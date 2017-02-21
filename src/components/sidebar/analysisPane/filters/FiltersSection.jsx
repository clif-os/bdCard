import './FiltersSection.styl';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import Filter from './Filter.jsx';

const fakeFields= [];
for (var i = 1; i < 52; i++){
  fakeFields.push({value: 'longoptionnameasuh-' + i, label: 'longoptionnameasuh-' + i});
}
console.log(fakeFields);
const fakeYears=[
  {value: '1990', label: '1990'},
  {value: '2000', label: '2000'},
  {value: '2010', label: '2010'},
  {value: '2014', label: '2014'}
];

class FiltersSection extends React.Component {
  constructor(props){
    super();
    this.handleAddFilter = this.handleAddFilter.bind(this);
  }

  handleAddFilter(){
    console.log('trying to rotate');
    const currentRotationCSS = this.refs.faPlusRotator.style.transform;
    
    if (currentRotationCSS === ''){
      console.log('in undefined area')
      this.refs.faPlusRotator.style.transform = 'rotateZ(90deg)'
    } else {
      console.log('in defined area')
      const currentRotation = parseInt(currentRotationCSS.split('(')[1].slice(0,-1));
      console.log(currentRotation);
      this.refs.faPlusRotator.style.transform = `rotateZ(${currentRotation + 90}deg)`
    }
  }

  render() {
    return (
      <div className="filtersSection section">
        <div className='header'>
          <span className='header-title'>
            Filters<span className='fa fa-filter'/>
            <div className='addFilterButton' onClick={this.handleAddFilter}>
              <div className='faPlusRotator' ref='faPlusRotator'>
                <span className='fa fa-plus'/>
              </div>
            </div>
          </span>
        </div>
        <div className='filtersContainer'>
          <Filter id={1} fields={fakeFields} years={fakeYears} />
          <Filter id={2} fields={fakeFields} years={fakeYears} />
          <Filter id={3} fields={fakeFields} years={fakeYears} />
        </div>
      </div>
    );
  }
}

 export default FiltersSection;

 //data-tip='Add A Filter' data-for='addFilterTooltip'
 //<ReactTooltip id='addFilterTooltip' type='dark' place='right' effect='solid' className='addFilterTooltip' offset="{'right': 5}"/>