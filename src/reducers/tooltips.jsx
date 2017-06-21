// tooltips depend on a simple binary switch
// the rest of their behaviour is determined by CSS keyframes
const defaultState = {
  mapSplitter: 0,
};

export const tooltips = (state = defaultState, action) => {
  switch (action.type) {
    case 'MAP_LOADED':
      return {
        ...state,
        mapSplitter: state.mapSplitter + 1,
      };
    default:
      return state;
  }
};
