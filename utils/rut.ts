
export const validateRut = (rut: string): boolean => {
  if (!rut || rut.trim() === '') return false;
  let value = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (value.length < 2) return false;
  const body = value.slice(0, -1);
  const dv = value.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i)) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const expectedDvResult = 11 - (sum % 11);
  let expectedDv = expectedDvResult === 11 ? '0' : expectedDvResult === 10 ? 'K' : expectedDvResult.toString();
  return dv === expectedDv;
};

export const formatRut = (rut: string): string => {
  let value = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (value.length <= 1) return value;
  const body = value.slice(0, -1);
  const dv = value.slice(-1);
  let formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedBody}-${dv}`;
};
