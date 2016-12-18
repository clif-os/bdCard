import './AppInterface.styl';
import YearSwitchPane from './components/YearSwitchPane.jsx'
import FieldSwitchPane from './components/FieldSwitchPane.jsx'
import Legend from './components/Legend.jsx'
import React from 'react';

class AppInterface extends React.Component {

  render() {
    return (
      <div className="AppInterface">
        <span className="title">TBF Gentrification Data Visualization Demo</span>
        <YearSwitchPane years={this.props.years} />
        <FieldSwitchPane fields={this.props.fields} />
        <Legend legend={this.props.legend} />
      </div>
    );
  }
}
 export default AppInterface;