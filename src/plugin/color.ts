// Calculate color

export const colorNumberToHex = (color:number):string => {
  const hex = Math.round(color * 255).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r:number, g:number, b:number):string {
  console.log("r:"+r+" g:"+g+" b:"+b);
  console.log("r:"+colorNumberToHex(r)+" g:"+colorNumberToHex(g)+" b:"+colorNumberToHex(b));  
  return "#" + colorNumberToHex(r) + colorNumberToHex(g) + colorNumberToHex(b)
}

export function colorToHex(color:any):string{
  return rgbToHex(color["r"], color["g"], color["b"]);
}