export const toggleSelectorOpen = () => ({
  type: 'TOGGLE_SELECTOR_OPEN',
});

export const prepareMapLoad = (nodeId, optionData) => ({
  type: 'PREPARE_MAP_LOAD',
  chosenId: nodeId,
  chosenOptionData: optionData,
});

export const mapLoaded = nodeId => ({
  type: 'MAP_LOADED',
});
