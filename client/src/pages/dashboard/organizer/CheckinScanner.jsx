import { QRScanner } from '../../../components/QRScanner';
import { useCheckin } from '../../../hooks/useBookings';

export const CheckinScanner = () => {
  const checkin = useCheckin();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Check-in Scanner</h1>
      <p className="text-text-muted text-sm mb-8">Scan attendee QR codes to mark them as checked in</p>
      <QRScanner onScan={(data) => checkin.mutate(data)} />
      {checkin.isSuccess && checkin.data && (
        <div className="glass rounded-xl p-4 mt-6 text-center">
          <p className="text-success font-semibold">✓ Checked in successfully</p>
          <p className="text-text-muted text-sm mt-1">{checkin.data.data.attendee?.name}</p>
        </div>
      )}
    </div>
  );
};
