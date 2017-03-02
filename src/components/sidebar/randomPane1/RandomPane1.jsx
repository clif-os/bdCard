import './RandomPane1.styl';
import React from 'react';

class RandomPane1 extends React.Component {
  constructor(props){
    super();
  }

  render() {
    return (
      <div className="randomPane1 sidebarPane">
        <div className='randomPane1Watermark-container'>
          <span className='fa fa-gear' />
        </div>
      </div>
    );
  }
}
 export default RandomPane1;