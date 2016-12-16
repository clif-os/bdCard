import './AppInterface.styl';
import YearSwitchPane from './components/YearSwitchPane.jsx'
import React from 'react';

class AppInterface extends React.Component {

  render() {
    return (
      <div className="AppInterface">
        <span className="title">TBF Gentrification Data Visualization Demo</span>
        <YearSwitchPane years={this.props.years} />
      </div>
    );
  }
}
 export default AppInterface;