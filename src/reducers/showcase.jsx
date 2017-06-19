import { mapStyles } from '../components/mapShowcaser/map/mapStyle_data.jsx';

const defaultShowcaseState = {
  handlingMapChoice: false,
  selectorOpen: true,
  onBoarding: true,
  chosenOptionData: mapStyles[0],
};

const defaultState = {
  mapSplit: false,
  showcase1: defaultShowcaseState,
  showcase2: defaultShowcaseState,
  chosenOptionsIds: {
    showcase1: null,
    showcase2: null,
  },
  primaryShowcase: 'showcase1',
};

const showcaseToggler = {
  showcase1: 'showcase2',
  showcase2: 'showcase1',
};

// TOGGLE SELECTOR OPEN is a weird place to put onBoarding, but is actually effective...

export const showcase = (state = defaultState, action) => {
  switch (action.type) {
    case 'SPLIT_MAP':
      return {
        ...state,
        mapSplit: true,
      };
    case 'UNSPLIT_MAPS':
      return {
        ...state,
        mapSplit: false,
        chosenOptionsIds: {
          ...state.chosenOptionsIds,
          [action.showcaseId]: null,
        },
        primaryShowcase: showcaseToggler[action.showcaseId],
        [action.showcaseId]: defaultShowcaseState,
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
        chosenOptionsIds: {
          ...state.chosenOptionsIds,
          [action.showcaseId]: action.chosenOptionId,
        },
        [action.showcaseId]: {
          ...state[action.showcaseId],
          handlingMapChoice: true,
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
