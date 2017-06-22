import { combineReducers } from 'redux';
import { colors } from './colors.jsx';
import { loaders } from './loaders.jsx';

const bdCard = combineReducers({
  colors,
  loaders,
});

export default bdCard;
