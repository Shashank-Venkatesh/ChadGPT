import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import Loading from '../pages/Loading';
import toast from 'react-hot-toast';

const Community = () => {

  const { axios } = useAppContext();
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchImages = async () => {
    try {
      const {data} = await axios.get('/api/user/published-images');
      if(data.success){
        setImages(data.images);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  if(loading) return <Loading/>

  return (
    <div className='flex-1 h-screen overflow-y-scroll premium-scroll relative bg-[var(--bg-base)]'>
      {/* Background */}
      <div className='absolute inset-0 gradient-mesh opacity-30 pointer-events-none' />
      <div className='orb orb-pink w-[300px] h-[300px] -top-20 right-20 opacity-20' />

      <div className='relative z-10 max-w-6xl mx-auto px-6 py-16'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[var(--text-secondary)] mb-6'>
            <span>🎨</span> Community Gallery
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold text-[var(--text-heading)] mb-4'>
            Explore <span className='gradient-text'>creations</span>
          </h1>
          <p className='text-[var(--text-secondary)] max-w-md mx-auto'>
            Stunning AI-generated artwork shared by our community members.
          </p>
        </div>

        {images.length > 0 ? (
          <div className='columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'>
            {images.map((item, index) => (
              <a
                key={index}
                href={item.imageUrl}
                target='_blank'
                className='block rounded-xl overflow-hidden group card-hover break-inside-avoid'
              >
                <div className='relative'>
                  <img
                    src={item.imageUrl}
                    alt=""
                    className='w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
                  />
                  {/* Overlay on hover */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-full gradient-purple flex items-center justify-center text-[8px] font-bold'>
                        {item.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <span className='text-xs text-white font-medium'>{item.username}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-16 h-16 rounded-2xl glass flex items-center justify-center text-2xl mb-4'>
              🖼️
            </div>
            <p className='text-[var(--text-secondary)] text-lg font-medium'>No images yet</p>
            <p className='text-[var(--text-muted)] text-sm mt-1'>Be the first to share a creation!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community;
