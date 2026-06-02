import QRCode from 'qrcode';

export const generateBookingQR = async (bookingId) => {
  const payload = JSON.stringify({ bookingId: bookingId.toString(), type: 'evenzo-ticket' });
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: { dark: '#6C63FF', light: '#FFFFFF' },
  });
};

export const parseQRPayload = (raw) => {
  try {
    const data = JSON.parse(raw);
    if (data.bookingId && data.type === 'evenzo-ticket') {
      return data.bookingId;
    }
    return raw;
  } catch {
    return raw;
  }
};
