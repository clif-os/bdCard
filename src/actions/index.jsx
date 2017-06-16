export const mapSplit = () => ({
  type: 'MAP_SPLIT',
});

export const toggleSelectorOpen = showcaseId => ({
  type: 'TOGGLE_SELECTOR_OPEN',
  showcaseId,
});

export const prepareMapLoad = (showcaseId, nodeId, optionData) => ({
  type: 'PREPARE_MAP_LOAD',
  showcaseId,
  chosenId: nodeId,
  chosenOptionData: optionData,
});

export const mapLoaded = showcaseId => ({
  type: 'MAP_LOADED',
  showcaseId,
});
