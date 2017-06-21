import { combineReducers } from 'redux';
import { showcase } from './showcase.jsx';
import { tooltips } from './tooltips.jsx';

const bmShowcaseApp = combineReducers({
  showcase,
  tooltips,
});

export default bmShowcaseApp;
