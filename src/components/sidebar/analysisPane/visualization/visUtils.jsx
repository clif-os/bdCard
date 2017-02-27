export const constructVisEventData = visSetting => {
  return {
    field: visSetting.fieldValue,
    classes: visSetting.classNumValue,
    palette: visSetting.paletteValue
  }
}

export const visEventsAreDifferent = (last, next) => {
  if (last === null){
    return true;
  }
  if (last.field !== next.field || 
      last.classes !== next.classes ||
      last.palette !== next.palette) {
    return true;
  } else {
    return false;
  }
}