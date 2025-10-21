// --- FILE: src/lib/phone.js ---
/** Formateo de teléfonos “bonito” por país + utilidades */
export const digitsOnly = (s = '') => String(s).replace(/\D/g, '');

const MAP = {
  HN: { code: '504', groups: [4, 4] },       // 9632 1907
  US: { code: '1', groups: [3, 3, 4], paren: true }, // (555) 123-4567
  MX: { code: '52', groups: [2, 4, 4] },
  ES: { code: '34', groups: [3, 3, 3] },
  CR: { code: '506', groups: [4, 4] },
  GT: { code: '502', groups: [4, 4] },
  SV: { code: '503', groups: [4, 4] },
  NI: { code: '505', groups: [4, 4] },
  PA: { code: '507', groups: [4, 4] },
};

export function formatPhoneE164ToDisplay(rawDigits, country = 'HN') {
  const d = digitsOnly(rawDigits);
  const meta = MAP[country] || {};
  const cc = meta.code || '';
  const hasCC = cc && d.startsWith(cc);
  const local = hasCC ? d.slice(cc.length) : d;

  if (meta.paren) {
    // (XXX) XXX-XXXX
    const a = local.slice(0, 3);
    const b = local.slice(3, 6);
    const c = local.slice(6);
    const pretty = c ? `(${a}) ${b}-${c}` : b ? `(${a}) ${b}` : `(${a})`;
    return { display: `+${cc} ${pretty}`.trim(), e164: `+${d}`, local };
  }

  // agrupar según config (con espacios finos)
  const groups = meta.groups || [3, 3, 4];
  let out = [], i = 0;
  for (const g of groups) {
    const part = local.slice(i, i + g);
    if (!part) break;
    out.push(part);
    i += g;
  }
  if (i < local.length) out.push(local.slice(i));
  const pretty = out.join('\u202f'); // espacio fino
  return { display: `+${hasCC ? cc + ' ' : ''}${pretty}`.trim(), e164: `+${d}`, local };
}
