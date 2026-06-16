import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Checkout({ onSubscribe }) {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'upi'
  const [loading, setLoading] = useState(false);

  if (!plan) {
    navigate('/plans');
    return null;
  }

  const handlePayment = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a payment delay
    setTimeout(() => {
      setLoading(false);
      onSubscribe(plan.id); // Update global state with the new plan
      navigate('/'); // Redirect to home
    }, 2000);
  };

  return (
    <div className="checkout-screen" style={{ minHeight: '100vh', padding: '100px 4%' }}>
      <Navbar />
      <div 
        className="checkout-container" 
        style={{ 
          maxWidth: '500px', 
          margin: '0 auto', 
          backgroundColor: '#f4f4f4', 
          color: '#333', 
          padding: '2rem', 
          borderRadius: '8px' 
        }}
      >
        <h1 style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          Secure Checkout
        </h1>
        
        <div style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
          Selected Plan: <strong>{plan.name}</strong> <br/>
          Total Due: <strong>{plan.price}</strong>/mo
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '10px' }}>
          <button 
            style={{
              flex: 1, padding: '10px', 
              backgroundColor: paymentMethod === 'card' ? '#333' : '#ddd',
              color: paymentMethod === 'card' ? 'white' : 'black',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('card')}
          >
            Credit/Debit Card
          </button>
          <button 
            style={{
              flex: 1, padding: '10px', 
              backgroundColor: paymentMethod === 'upi' ? '#333' : '#ddd',
              color: paymentMethod === 'upi' ? 'white' : 'black',
              border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}
            onClick={() => setPaymentMethod('upi')}
          >
            UPI
          </button>
        </div>

        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paymentMethod === 'card' ? (
            <>
              <input type="text" placeholder="Card Number" required style={inputStyle} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="MM/YY" required style={inputStyle} />
                <input type="text" placeholder="CVC" required style={inputStyle} />
              </div>
              <input type="text" placeholder="Cardholder Name" required style={inputStyle} />
            </>
          ) : (
            <>
              <input type="text" placeholder="Enter UPI ID (e.g., user@upi)" required style={inputStyle} />
            </>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${plan.price}`}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box'
};

export default Checkout;
