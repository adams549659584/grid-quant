import Pako from 'pako';

export function compress(str: string) {
  const uint8Arr = Pako.deflate(str);
  return uint8Arr.toString();
}

export function unCompress(base64Str: string) {
  const uint8Str = base64Str;
  const uint8Arr = Uint8Array.from(uint8Str.split(',').map((x) => +x));
  return Pako.inflate(uint8Arr, { to: 'string' });
}
