const defaultState = {
  colorIndex: 1,
};

// TOGGLE SELECTOR OPEN is a weird place to put onBoarding, but is actually effective...

export const colors = (state = defaultState, action) => {
  switch (action.type) {
    case 'INCREMENT_COLOR_INDEX':
      return {
        ...state,
        colorIndex: state.colorIndex === 4 ? 1 : state.colorIndex + 1,
      };
    default:
      return state;
  }
};
