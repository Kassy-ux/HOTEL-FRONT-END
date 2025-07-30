import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import axios from 'axios';

// In your StripeCheckoutButton component file
interface MyPaymentProps {
  bookingId: number;
  amount: number;
  className?: string;  // Add this line
}

const StripeCheckoutButton: React.FC<MyPaymentProps> = ({ bookingId, amount  }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://stayluxe-e76y.onrender.com/api/payments/create-checkout-session', {
        bookingId,
        amount,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError('Unable to get Stripe checkout URL.');
      }
    } catch (err) {
      console.error(err);
      setError('Payment initiation failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xs">
      {error && (
        <div className="text-red-600 text-sm flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" /> Processing...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" /> Pay Now
          </>
        )}
      </button>
    </div>
  );
};

export default StripeCheckoutButton;
