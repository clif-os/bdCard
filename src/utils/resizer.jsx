const defaultHeight = window.innerHeight;
const defaultWidth = window.innerWidth;

let lastMeasurement = {
  height: defaultHeight,
  width: defaultWidth,
};
let measurementIndex = 0;

export const handleAppResize = () => {
  // resize application accounts for the navigation bar on mobile devices by using innerHeight
  const newHeight = window.innerHeight;
  const newWidth = window.innerWidth;
  if (measurementIndex === 0 || newHeight !== lastMeasurement.height) {
    document.getElementById('appInterface-container').style.height = `${newHeight}px`;
  }
  lastMeasurement = {
    height: newHeight,
    width: newWidth,
  };
  measurementIndex += 1;
};
