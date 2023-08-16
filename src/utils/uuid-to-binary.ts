export function uuidToBinary(uuid: string): Buffer {
  const hexStr = uuid.replace(/-/g, '');

  return Buffer.from(hexStr, 'hex');
}
