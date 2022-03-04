import Pako from 'pako';

export function compress(str: string) {
  const compressedArr = Pako.deflate(str);
  return String.fromCharCode.apply(null, new Uint16Array(compressedArr) as any as number[]);
}

export function unCompress(uint16Str: string) {
  const buf = new ArrayBuffer(uint16Str.length * 2);
  var bufView = new Uint16Array(buf);
  for (let i = 0, strLen = uint16Str.length; i < strLen; i++) {
    bufView[i] = uint16Str.charCodeAt(i);
  }
  // return buf;
  return Pako.inflate(buf as any, { to: 'string' });
}
