import React from 'react'
import Masonry from 'react-masonry-css';
import Announcement from './Announcement';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AnnouncementMasonryLayout  = ({posts}) => {
  
  const navigate = useNavigate()

  const breakpointColumnsObj = {
    default: 1,
  };
  const hasNoAnnouncements = posts.length <= 0
  
  return (
    
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
            <span>
              <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
            </span>
            <p className='font-bold text-slate-500'>
              All Announcements
            </p>
      </div>
      {hasNoAnnouncements && (
        <p className='w-full text-center  py-2'>No announcements</p>
      )}
      {
          posts.map((post)=>{
            return <Announcement key={post.docId} post={post}/>
          })
      }
      
    </Masonry>
  )

}

export default AnnouncementMasonryLayout;

