import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import Loading from './Loading.jsx'
import toast from 'react-hot-toast'

const Credits = () => {

  const { axios, token } = useAppContext();
  const [plans, setPlans] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const fetchPlans = async () => {
    try {
      const {data} = await axios.get('/api/credit/plan');
      if(data.success){
        setPlans(data.plans);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handlePurchase = async (planId) => {
    try {
      const {data} = await axios.post('/api/credit/purchase', {planId}, {headers: {Authorization: token}});
      if(data.success){
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  const tierIcons = ['⚡', '🚀', '💎'];
  const tierColors = [
    'from-blue-500/20 to-blue-600/5',
    'from-purple-500/20 to-purple-600/5',
    'from-amber-500/20 to-amber-600/5'
  ];

  return (
    <div className='flex-1 h-screen overflow-y-scroll premium-scroll relative bg-[var(--bg-base)]'>
      {/* Background */}
      <div className='absolute inset-0 gradient-mesh opacity-40 pointer-events-none' />
      <div className='orb orb-purple w-[400px] h-[400px] -top-40 right-0 opacity-20' />
      
      <div className='relative z-10 max-w-5xl mx-auto px-6 py-16'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[var(--text-secondary)] mb-6'>
            <span>💎</span> Flexible Pricing
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold text-[var(--text-heading)] mb-4'>
            Choose your <span className='gradient-text'>plan</span>
          </h1>
          <p className='text-[var(--text-secondary)] max-w-md mx-auto'>
            Pay for what you use. Every plan includes full access to Nexus AI capabilities.
          </p>
        </div>

        {/* Plans Grid */}
        <div className='grid md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
          {plans.map((plan, index) => {
            const isPopular = index === 1;
            return (
              <div
                key={plan._id}
                className={`relative glass rounded-2xl p-8 card-hover flex flex-col ${isPopular ? 'ring-1 ring-purple-500/30 border-purple-500/20' : ''}`}
              >
                {isPopular && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-purple text-xs font-semibold text-white'>
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierColors[index] || tierColors[0]} flex items-center justify-center text-xl mb-5`}>
                  {tierIcons[index] || '⚡'}
                </div>

                <h3 className='text-lg font-semibold text-[var(--text-heading)] mb-1'>{plan.name}</h3>
                
                <div className='flex items-baseline gap-1 mb-1'>
                  <span className='text-4xl font-bold text-[var(--text-heading)]'>${plan.price}</span>
                </div>
                <p className='text-sm text-[var(--text-muted)] mb-6'>{plan.credits} credits included</p>

                <ul className='space-y-3 mb-8 flex-1'>
                  {plan.features.map((feature, i) => (
                    <li key={i} className='flex items-center gap-2.5 text-sm text-[var(--text-secondary)]'>
                      <span className='text-green-400 text-xs'>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(plan._id)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
                    isPopular
                      ? 'btn-premium text-white'
                      : 'border border-[var(--border-main)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]'
                  }`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className='text-center text-xs text-[var(--text-muted)] mt-10'>
          All plans are one-time purchases. Credits never expire. Secured by Stripe.
        </p>
      </div>
    </div>
  )
}

export default Credits
