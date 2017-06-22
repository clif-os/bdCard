const defaultState = {
  musicLoaded: false,
};


// if incrementing is occuring, the music has loaded -- avoiding creation of another action
export const loaders = (state = defaultState, action) => {
  switch (action.type) {
    case 'INCREMENT_COLOR_INDEX':
      return {
        ...state,
        musicLoaded: true,
      };
    default:
      return state;
  }
};
