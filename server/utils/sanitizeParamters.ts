export function useSanitizeParams(eventContextParams: any) { 
  Object.keys(eventContextParams).forEach(function(key) {
    eventContextParams[key] = eventContextParams[key].replaceAll(':','');
  });
  return eventContextParams;
}