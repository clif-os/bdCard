import { combineReducers } from 'redux';
import { showcase } from './showcase.jsx';
import { responsive } from './responsive.jsx';

const bmShowcaseApp = combineReducers({
  showcase,
  responsive,
});

export default bmShowcaseApp;
