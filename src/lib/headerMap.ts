export const HEADER_MAP: Record<string, string[]> = {
  deliveryAssociate: ['Delivery Associate', 'Delivery Associate ', 'Associate Name', 'Employee Name', 'DA Name'],
  trackingId: ['Tracking ID', 'Tracking', 'Track ID', 'Shipment ID'],
  transporterId: ['Transporter ID', 'Transporter', 'Carrier ID', 'Transport'],
  impactDcr: ['Impact DCR', 'Impact', 'DCR Impact', 'DCR'],
  rtsCode: ['DA Selected RTS Code', 'RTS Code', 'Selected RTS Code', 'RTS', 'Return To Stock'],
  additionalInformation: ['Additional Information', 'Additional Info', 'Notes', 'Info'],
  exemptionReason: ['Exemption Reason', 'Exemption', 'Exempt Reason'],
  plannedDeliveryDate: ['Planned Delivery Date', 'Delivery Date', 'Date', 'Planned Date', 'Scheduled Delivery'],
  serviceArea: ['Service Area', 'Area', 'Svc Area', 'Zone'],
};

export function mapCsvHeaders(headers: string[]): Record<string, number> {
  const mapping: Record<string, number> = {};

  for (const [field, variants] of Object.entries(HEADER_MAP)) {
    let found = false;
    for (const variant of variants) {
      const idx = headers.findIndex(h => h.trim().toLowerCase() === variant.trim().toLowerCase());
      if (idx !== -1) {
        mapping[field] = idx;
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`Header mapping not found for field: ${field}`);
    }
  }

  return mapping;
}

export const RTS_CODE_ALIASES: Record<string, string> = {
  'OODT': 'OUT OF DRIVING TIME',
  'OUT OF DRIVE TIME': 'OUT OF DRIVING TIME',
};

export function normalizeRTSCode(code: string): string {
  const trimmed = code.trim();
  const upper = trimmed.toUpperCase();
  return RTS_CODE_ALIASES[upper] || trimmed;
}

export function parseDate(value: string): Date | null {
  if (!value || !value.trim()) return null;

  const trimmed = value.trim();

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  const usMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (usMatch) {
    const y = parseInt(usMatch[3], 10);
    const m = parseInt(usMatch[1], 10) - 1;
    const d = parseInt(usMatch[2], 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  const usMatch2 = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);
  if (usMatch2) {
    const y = parseInt(usMatch2[3], 10);
    const m = parseInt(usMatch2[1], 10) - 1;
    const d = parseInt(usMatch2[2], 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) return d;

  return null;
}
