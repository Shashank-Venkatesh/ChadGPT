import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const LandingPage = () => {

  const { navigate } = useAppContext();

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Powered by Gemini 3 Flash for instant, intelligent responses to any question.'
    },
    {
      icon: '🎨',
      title: 'AI Image Generation',
      description: 'Create stunning visuals from text prompts with state-of-the-art image AI.'
    },
    {
      icon: '🌐',
      title: 'Community Gallery',
      description: 'Share your AI-generated images and explore creations from others.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'End-to-end encrypted conversations. Your data stays yours.'
    },
    {
      icon: '💬',
      title: 'Context-Aware Chat',
      description: 'Nexus remembers your conversation history for seamless, coherent dialogues.'
    },
    {
      icon: '💎',
      title: 'Flexible Credits',
      description: 'Pay only for what you use with affordable credit packages.'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '1M+', label: 'Messages Sent' },
    { value: '50K+', label: 'Images Created' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className='min-h-screen bg-[#0A0A12] text-white overflow-x-hidden'>

      {/* ─── Navbar ─── */}
      <nav className='fixed top-0 w-full z-50 glass border-b border-white/5'>
        <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <img src={assets.logo_full} alt="ChadGPT" className='h-8' />
          <div className='hidden md:flex items-center gap-8 text-sm text-gray-400'>
            <a href="#features" className='hover:text-white transition-colors'>Features</a>
            <a href="#pricing" className='hover:text-white transition-colors'>Pricing</a>
            <a href="#community" className='hover:text-white transition-colors'>Community</a>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/login')}
              className='px-5 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer'
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className='btn-premium px-5 py-2 text-sm rounded-xl font-medium cursor-pointer'
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className='relative pt-32 pb-20 px-6'>
        {/* Background Orbs */}
        <div className='orb orb-purple w-[600px] h-[600px] -top-40 left-1/4 animate-float opacity-50' />
        <div className='orb orb-blue w-[400px] h-[400px] top-20 right-10 animate-float delay-300 opacity-40' />
        <div className='orb orb-pink w-[300px] h-[300px] bottom-0 left-10 animate-pulse-glow opacity-30' />

        <div className='relative z-10 max-w-5xl mx-auto text-center'>
          {/* Badge */}
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-purple-300 mb-8 animate-fade-in-up'>
            <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            Powered by Gemini 3 Flash
          </div>

          {/* Heading */}
          <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-fade-in-up delay-100'>
            The Future of AI,
            <br />
            <span className='gradient-text'>Right at Your Fingertips</span>
          </h1>

          <p className='mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200'>
            Chat with Nexus — an AI that understands context, generates images, 
            and delivers answers with unprecedented speed and precision.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up delay-300'>
            <button
              onClick={() => navigate('/login')}
              className='btn-premium px-8 py-4 rounded-xl text-base font-semibold tracking-wide cursor-pointer'
            >
              Start Chatting Free →
            </button>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className='px-8 py-4 rounded-xl text-base font-medium glass hover:bg-white/10 transition-all cursor-pointer'
            >
              Explore Features
            </button>
          </div>

          {/* Hero Visual / Mockup */}
          <div className='mt-16 relative animate-fade-in-up delay-400'>
            <div className='glass-strong rounded-2xl p-1 max-w-3xl mx-auto'>
              <div className='bg-[#0D0B14] rounded-xl p-6 sm:p-8'>
                {/* Mock chat bubbles */}
                <div className='space-y-4'>
                  <div className='flex justify-end'>
                    <div className='glass rounded-xl px-4 py-3 max-w-xs sm:max-w-md text-sm text-left'>
                      What's the theory of relativity in simple terms?
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    <div className='bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 max-w-xs sm:max-w-lg text-sm text-left text-gray-300'>
                      Einstein's theory says that space and time are woven together, and massive objects bend this fabric — like a bowling ball on a trampoline. The faster you move, the slower time passes for you. And that famous equation E=mc² shows that a tiny bit of matter holds enormous energy. ✨
                    </div>
                  </div>
                </div>
                <div className='mt-6 flex items-center gap-3 glass rounded-xl px-4 py-3'>
                  <span className='text-gray-500 text-sm flex-1'>Ask Nexus anything...</span>
                  <div className='w-8 h-8 rounded-lg gradient-purple flex items-center justify-center'>
                    <span className='text-white text-xs'>→</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow behind card */}
            <div className='absolute inset-0 -z-10 bg-gradient-to-t from-purple-500/20 via-transparent to-transparent blur-3xl' />
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className='py-12 border-y border-white/5'>
        <div className='max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, i) => (
            <div key={i} className='text-center'>
              <p className='text-3xl font-bold gradient-text'>{stat.value}</p>
              <p className='text-sm text-gray-500 mt-1'>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className='py-24 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='text-sm font-medium text-purple-400 uppercase tracking-wider mb-3'>Features</p>
            <h2 className='text-4xl sm:text-5xl font-bold'>
              Everything you need,{' '}
              <span className='gradient-text'>nothing you don't</span>
            </h2>
            <p className='mt-4 text-gray-400 max-w-xl mx-auto'>
              A complete AI assistant with text generation, image creation, and community sharing — all in one sleek interface.
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, i) => (
              <div
                key={i}
                className='glass rounded-2xl p-6 card-hover group'
              >
                <div className='w-12 h-12 rounded-xl gradient-purple flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Preview ─── */}
      <section id="pricing" className='py-24 px-6 relative'>
        <div className='orb orb-purple w-[400px] h-[400px] top-0 right-0 opacity-20' />
        <div className='max-w-5xl mx-auto relative z-10'>
          <div className='text-center mb-16'>
            <p className='text-sm font-medium text-purple-400 uppercase tracking-wider mb-3'>Pricing</p>
            <h2 className='text-4xl sm:text-5xl font-bold'>
              Simple, <span className='gradient-text'>transparent</span> pricing
            </h2>
            <p className='mt-4 text-gray-400 max-w-xl mx-auto'>
              Start free and upgrade when you need more. No hidden fees, no surprises.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            {/* Basic */}
            <div className='glass rounded-2xl p-8 card-hover'>
              <p className='text-sm font-medium text-gray-400'>Basic</p>
              <p className='text-4xl font-bold mt-2'>$10</p>
              <p className='text-sm text-gray-500 mt-1'>100 credits</p>
              <ul className='mt-6 space-y-3 text-sm text-gray-300'>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Text generation</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Chat history</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Community access</li>
              </ul>
              <button onClick={() => navigate('/login')} className='mt-8 w-full py-3 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-all cursor-pointer'>
                Get Started
              </button>
            </div>

            {/* Pro - Featured */}
            <div className='relative glass rounded-2xl p-8 card-hover border-purple-500/30 ring-1 ring-purple-500/20'>
              <div className='absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-purple text-xs font-semibold'>
                Most Popular
              </div>
              <p className='text-sm font-medium text-purple-400'>Pro</p>
              <p className='text-4xl font-bold mt-2'>$20</p>
              <p className='text-sm text-gray-500 mt-1'>500 credits</p>
              <ul className='mt-6 space-y-3 text-sm text-gray-300'>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Everything in Basic</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Image generation</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Priority support</li>
              </ul>
              <button onClick={() => navigate('/login')} className='btn-premium mt-8 w-full py-3 rounded-xl text-sm font-semibold cursor-pointer'>
                Get Started
              </button>
            </div>

            {/* Premium */}
            <div className='glass rounded-2xl p-8 card-hover'>
              <p className='text-sm font-medium text-gray-400'>Premium</p>
              <p className='text-4xl font-bold mt-2'>$30</p>
              <p className='text-sm text-gray-500 mt-1'>1000 credits</p>
              <ul className='mt-6 space-y-3 text-sm text-gray-300'>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Everything in Pro</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Bulk image generation</li>
                <li className='flex items-center gap-2'><span className='text-green-400'>✓</span> Early access features</li>
              </ul>
              <button onClick={() => navigate('/login')} className='mt-8 w-full py-3 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-all cursor-pointer'>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Community Preview ─── */}
      <section id="community" className='py-24 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-16'>
            <p className='text-sm font-medium text-purple-400 uppercase tracking-wider mb-3'>Community</p>
            <h2 className='text-4xl sm:text-5xl font-bold'>
              See what others are <span className='gradient-text'>creating</span>
            </h2>
            <p className='mt-4 text-gray-400 max-w-xl mx-auto'>
              Browse stunning AI-generated artwork from our community and share your own.
            </p>
          </div>

          {/* Image Grid Preview */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[assets.ai_image1, assets.ai_image2, assets.ai_image3, assets.ai_image4,
              assets.ai_image5, assets.ai_image6, assets.ai_image7, assets.ai_image8].map((img, i) => (
              <div key={i} className='rounded-xl overflow-hidden group cursor-pointer card-hover'>
                <img
                  src={img}
                  alt=""
                  className='w-full h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500'
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className='py-24 px-6 relative'>
        <div className='orb orb-purple w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30' />
        <div className='relative z-10 max-w-3xl mx-auto text-center'>
          <h2 className='text-4xl sm:text-5xl font-bold'>
            Ready to experience{' '}
            <span className='gradient-text'>the future?</span>
          </h2>
          <p className='mt-4 text-gray-400 text-lg'>
            Join thousands of users already creating with ChadGPT.
          </p>
          <button
            onClick={() => navigate('/login')}
            className='btn-premium mt-8 px-10 py-4 rounded-xl text-base font-semibold cursor-pointer'
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className='border-t border-white/5 py-8 px-6'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
          <img src={assets.logo_full} alt="ChadGPT" className='h-6 opacity-60' />
          <p className='text-xs text-gray-600'>
            © {new Date().getFullYear()} ChadGPT. All rights reserved.
          </p>
          <div className='flex items-center gap-6 text-xs text-gray-500'>
            <a href="#" className='hover:text-white transition-colors'>Privacy</a>
            <a href="#" className='hover:text-white transition-colors'>Terms</a>
            <a href="#" className='hover:text-white transition-colors'>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
