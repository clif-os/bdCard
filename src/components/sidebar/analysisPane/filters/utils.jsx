// const fakeYears=[
//   {value: '1990', label: '1990'},
//   {value: '2000', label: '2000'},
//   {value: '2010', label: '2010'},
//   {value: '2014', label: '2014'}
// ];
export const convertPropsMetadataToDrodownObject = (metadata) => {
  return Object.keys(metadata).map( prop => {
    return {
      value: prop,
      label: metadata[prop].description
    }
  })
}