import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';

function ProfileScreen({ user, onSubscribe, onCancel }) {
  const navigate = useNavigate();
  const currentPlanId = localStorage.getItem('netflix_plan') || 'none';

  const plans = [
    { id: 'free', name: 'Free Plan', description: 'Access all contents with Ads', price: 'Free', level: 0 },
    { id: 'basic', name: 'Basic', description: '720p', price: '₹199', level: 1 },
    { id: 'standard', name: 'Standard', description: '1080p', price: '₹499', level: 2 },
    { id: 'premium', name: 'Premium', description: '4K + HDR', price: '₹649', level: 3 },
  ];

  const currentPlanLevel = plans.find(p => p.id === currentPlanId)?.level ?? -1;

  const handleLogout = () => {
    signOut(auth);
  };

  const handlePlanAction = (plan) => {
    if (plan.id === currentPlanId) return;

    if (plan.price === 'Free') {
      onSubscribe(plan.id);
    } else {
      navigate('/checkout', { state: { plan } });
    }
  };

  return (
    <div className="profile-screen" style={{ minHeight: '100vh', backgroundColor: '#111', color: 'white' }}>
      <Navbar />
      <div className="profile-body" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '150px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '400', borderBottom: '1px solid #282c34', paddingBottom: '10px', marginBottom: '20px' }}>
          Edit Profile
        </h1>
        
        <div className="profile-info" style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Avatar"
              style={{ height: '100px', borderRadius: '4px' }}
            />
            <div className="profile-details" style={{ flex: 1 }}>
              <h2 style={{ backgroundColor: '#333', padding: '15px', fontSize: '1.2rem', marginBottom: '20px' }}>
                {user?.email}
              </h2>
              
              <div className="profile-plans">
                <h3 style={{ borderBottom: '1px solid #282c34', paddingBottom: '10px', marginBottom: '10px' }}>
                  Plans (Current: {plans.find(p => p.id === currentPlanId)?.name || 'None'})
                </h3>
                
                {plans.map((plan) => {
                  const isCurrent = plan.id === currentPlanId;
                  const isUpgrade = plan.level > currentPlanLevel;
                  
                  return (
                    <div 
                      key={plan.id} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        backgroundColor: '#1f1f1f',
                        marginBottom: '15px',
                        borderRadius: '4px',
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{plan.name}</h4>
                        <p style={{ color: 'gray' }}>{plan.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>
                          {plan.price !== 'Free' ? `${plan.price}/mo` : plan.price}
                        </span>
                        <button 
                          onClick={() => handlePlanAction(plan)}
                          disabled={isCurrent}
                          style={{
                            padding: '10px 20px',
                            fontWeight: '600',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: isCurrent ? 'default' : 'pointer',
                            backgroundColor: isCurrent ? 'gray' : '#e50914',
                            color: 'white'
                          }}
                        >
                          {isCurrent ? 'Current Plan' : isUpgrade ? 'Upgrade' : 'Downgrade'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
                  <button 
                    onClick={onCancel}
                    style={{
                      padding: '15px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      backgroundColor: 'transparent',
                      border: '1px solid #e50914',
                      color: '#e50914',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Cancel Subscription
                  </button>

                  <button 
                    onClick={handleLogout}
                    style={{
                      padding: '15px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      backgroundColor: '#e50914',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    Sign Out
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;
