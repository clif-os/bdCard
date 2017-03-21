import { homesMap } from './memories.jsx';

var memory = {
  filters: {
    filterSettings: {},
    lastFilterEventData: null
  },
  visualizers: {
    visualizerChoice: 'classes',
    classes:{
      visSetting: {},
      lastVisEventData: null,
      firstDraw: true
    },
    passFail: {
      filterSettings: {},
      lastVisEventData: null,
      unvisualized: false
    }
  }
}

export const verifyMemory = incMemory => {
  let message = 'verified';
  let verified = true;
  if (! 'filters' in incMemory || !'visualizers' in incMemory){
    verified = false;
    message = "Missing critical keys";
  }
  if (! 'filterSettings' in incMemory['filters'] || !'lastFilterEventData' in incMemory['filters']){
    verified = false;
    message = "Missing critical keys";
  }
  if (! 'visualizerChoice' in incMemory['visualizers'] 
      || ! 'classes' in incMemory['visualizers'] 
      || ! 'passFail' in incMemory['visualizers']){
        verified = false;
        message = "Missing critical keys";
      }
  if (! 'visSetting' in incMemory['visualizers']['classes'] 
      || !'lastVisEventData' in incMemory['visualizers']['classes']
      || !'firstDraw' in incMemory['visualizers']['classes']){
        verified = false;
        message = "Missing critical keys";
      }
  if (! 'filterSettings' in incMemory['visualizers']['passFail'] 
      || !'lastVisEventData' in incMemory['visualizers']['passFail']
      || !'unvisualized' in incMemory['visualizers']['passFail']){
        verified = false;
        message = "Missing critical keys";
      }
  return {
    verified: verified,
    message: message
  }
}