import { mapStyles } from '../components/mapShowcaser/map/mapStyle_data.jsx';

const defaultShowcaseState = {
  handlingMapChoice: false,
  selectorOpen: true,
  onBoarding: true,
  chosenOptionData: mapStyles[0],
  chosenId: 'null',
};

const defaultState = {
  mapSplit: false,
  showcase1: defaultShowcaseState,
  showcase2: defaultShowcaseState,
};

// TOGGLE SELECTOR OPEN is a weird place to put onBoarding, but is actually effective...

export const showcase = (state = defaultState, action) => {
  switch (action.type) {
    case 'MAP_SPLIT':
      return {
        ...state,
        mapSplit: true,
      };
    case 'TOGGLE_SELECTOR_OPEN':
      return {
        ...state,
        [action.showcaseId]: {
          ...state[action.showcaseId],
          selectorOpen: !state[action.showcaseId].selectorOpen,
          onBoarding: false,
        },
      };
    case 'PREPARE_MAP_LOAD':
      return {
        ...state,
        [action.showcaseId]: {
          ...state[action.showcaseId],
          handlingMapChoice: true,
          chosenId: action.chosenId,
          chosenOptionData: action.chosenOptionData,
        },
      };
    case 'MAP_LOADED':
      return {
        ...state,
        [action.showcaseId]: {
          ...state[action.showcaseId],
          handlingMapChoice: false,
        },
      };
    default:
      return state;
  }
};
