function colorNumberToHex(color:number):string {
  var hex = Math.round(color * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r:number, g:number, b:number):string {
  return "#" + colorNumberToHex(r) + colorNumberToHex(g) + colorNumberToHex(b)
}

function colorToHex(color:any):string{
  return rgbToHex(color["r"], color["g"], color["b"]);
}