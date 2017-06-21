const defaultState = {
  mapSplitter: true,
};

export const tooltips = (state = defaultState, action) => {
  switch (action.type) {
    case 'MAP_LOADED':
      return {
        ...state,
        mapSplitter: false,
      };
    default:
      return state;
  }
};
