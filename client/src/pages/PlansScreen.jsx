import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PlansScreen({ onSubscribe }) {
  const navigate = useNavigate();

  const plans = [
    { id: 'free', name: 'Free Plan', description: 'Access all contents with Ads', price: 'Free' },
    { id: 'basic', name: 'Basic', description: '720p', price: '₹199' },
    { id: 'standard', name: 'Standard', description: '1080p', price: '₹499' },
    { id: 'premium', name: 'Premium', description: '4K + HDR', price: '₹649' },
  ];

  const handlePlanClick = (plan) => {
    if (plan.price === 'Free') {
      onSubscribe(plan.id);
    } else {
      navigate('/checkout', { state: { plan } });
    }
  };

  return (
    <div className="plans-screen" style={{ minHeight: '100vh', padding: '100px 4%' }}>
      <Navbar />
      <div className="plans-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '1px solid #282c34', paddingBottom: '10px' }}>
          Choose the plan that's right for you
        </h1>
        
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              backgroundColor: '#1f1f1f',
              marginBottom: '15px',
              borderRadius: '8px',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{plan.name}</h3>
              <p style={{ color: 'gray' }}>{plan.description}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{plan.price !== 'Free' ? `${plan.price}/mo` : plan.price}</span>
              <button 
                className="btn-primary" 
                onClick={() => handlePlanClick(plan)}
                style={{ padding: '10px 20px' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlansScreen;
