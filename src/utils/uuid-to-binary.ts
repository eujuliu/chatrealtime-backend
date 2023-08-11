export function uuidToBinary(uuid: string): Buffer {
  if (!uuid) {
    return Buffer.alloc(16);
  }

  const hexStr = uuid.replace(/-/g, '');

  return Buffer.from(hexStr, 'hex');
}
