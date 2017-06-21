export const splitMap = () => ({
  type: 'SPLIT_MAP',
});

export const unsplitMaps = showcaseId => ({
  type: 'UNSPLIT_MAPS',
  showcaseId,
});

export const toggleSelectorOpen = showcaseId => ({
  type: 'TOGGLE_SELECTOR_OPEN',
  showcaseId,
});

export const prepareMapLoad = (showcaseId, optionId, optionData) => ({
  type: 'PREPARE_MAP_LOAD',
  showcaseId,
  chosenOptionId: optionId,
  chosenOptionData: optionData,
});

export const mapLoaded = showcaseId => ({
  type: 'MAP_LOADED',
  showcaseId,
});
