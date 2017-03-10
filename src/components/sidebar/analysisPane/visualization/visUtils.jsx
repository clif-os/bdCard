export const constructVisEventData = visSetting => {
  return {
    field: visSetting.selectedProp,
    classes: visSetting.classNumValue,
    palette: visSetting.paletteValue,
    unitFormatter: visSetting.unitFormatter,
    visActive: visSetting.visActive
  }
}

export const visEventsAreDifferent = (last, next) => {
  if (last === null){
    return true;
  }
  if (last.field !== next.field || 
      last.classes !== next.classes ||
      last.palette !== next.palette || 
      last.visActive !== next.visActive ) {
    return true;
  } else {
    return false;
  }
}