import './AppInterface.styl';
import MapboxButtons from './components/MapboxButtons.jsx'
import YearSwitchPane from './components/YearSwitchPane.jsx'
import FieldSwitchPane from './components/FieldSwitchPane.jsx'
import SelectionPane from './components/selectionPane.jsx'
import Legend from './components/Legend.jsx'
import React from 'react';

class AppInterface extends React.Component {
  render() {
    return (
      <div className="AppInterface">
        <span className="title">TBF Gentrification Data Visualization Demo</span>
        <MapboxButtons />
        <SelectionPane />
        <div className="switchPanes">
          <FieldSwitchPane fields={this.props.fields} fieldLookups={this.props.fieldLookups}/>
          <YearSwitchPane years={this.props.years} />
        </div>
        <Legend legendFormats={this.props.legendFormats} />
      </div>
    );
  }
}
 export default AppInterface;