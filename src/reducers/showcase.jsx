import { mapStyles } from '../components/mapShowcaser/map/mapStyle_data.jsx';

const defaultState = {
  handlingMapChoice: false,
  selectorOpen: true,
  onBoarding: true,
  chosenOptionData: mapStyles[0],
};

// TOGGLE SELECTOR OPEN is a weird place to put onBoarding, but is actually effective...

export const showcase = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_SELECTOR_OPEN':
      return {
        ...state,
        selectorOpen: !state.selectorOpen,
        onBoarding: false,
      };
    case 'PREPARE_MAP_LOAD':
      return {
        ...state,
        handlingMapChoice: true,
        chosenId: action.chosenId,
        chosenOptionData: action.chosenOptionData,
      };
    case 'MAP_LOADED':
      return {
        ...state,
        handlingMapChoice: false,
      };
    default:
      return state;
  }
};
