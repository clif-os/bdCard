export const fitMapToPage = canvas => {
  var iHeight = canvas.clientHeight / 90; // approx inches
  var iWidth = canvas.clientWidth / 90;
  let orientation, dHeight, dWidth;
  if (iHeight > iWidth || iHeight === iWidth){
    orientation = 'portrait';
    dHeight = 11;
    dWidth = 8.5;
  } else if (iWidth > iHeight) {
    orientation = 'landscape';
    dHeight = 8.5;
    dWidth = 11;
  };
  const heightRatio = iHeight / (dHeight * .9); // cause buffer
  const widthRatio = iWidth / (dWidth * .9);
  if (heightRatio > 1 || widthRatio > 1){
    console.log('resizing image to fit document')
    let maxRatio = heightRatio >= widthRatio ? heightRatio : widthRatio;
    iHeight = iHeight / maxRatio;
    iWidth = iWidth / maxRatio;
  }
  const left = (dWidth - iWidth) / 2;
  const top = (dHeight - iHeight) / 2;
  return {
    orientation: orientation,
    dWidth: dWidth,
    dHeight: dHeight,
    iWidth: iWidth,
    iHeight: iHeight,
    left: left,
    top: top
  }
}