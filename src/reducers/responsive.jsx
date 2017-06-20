const defaultState = {};

const createNewSizes = (state = {}) => Object.keys(state).reduce((acc, id) => {
  const { classifier } = state[id];
  const classification = classifier(id);
  acc[id] = {
    classifier,
    class: classification,
  };
  return acc;
}, {});

const unregisterElementFromState = (state = {}, elementId) =>
Object.keys(state).reduce((acc, id) => {
  if (id !== elementId) {
    acc[id] = state[id];
  }
  return acc;
}, {});

export const responsive = (state = defaultState, action) => {
  switch (action.type) {
    case 'REGISTER_RESPONSIVE_ELEMENT':
      return {
        ...state,
        [action.elementId]: {
          classifier: action.elementClassifier,
          class: action.defaultClass,
        },
      };
    case 'UNREGISTER_RESPONSIVE_ELEMENT':
      return unregisterElementFromState(state, action.elementId);
    case 'RESPOND':
      return createNewSizes(state);
    default:
      return state;
  }
};
