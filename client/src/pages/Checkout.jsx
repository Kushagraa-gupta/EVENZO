import { useParams } from 'react-router-dom';
import { PageLoader } from '../components/ui/Spinner';

export const Checkout = () => {
  const { id } = useParams();
  return (
    <div className="max-w-xl mx-auto px-4 py-12 text-center">
      <PageLoader />
      <p className="text-text-muted mt-4">Redirecting to checkout for event {id}...</p>
    </div>
  );
};
