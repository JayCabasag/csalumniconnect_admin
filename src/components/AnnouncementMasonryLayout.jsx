import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Announcement from './Announcement';

const AnnouncementMasonryLayout  = ({posts}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };

  
  return (
    
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <Announcement key={post.docId} post={post}/>
          })
      }
      
    </Masonry>
  )

}

export default AnnouncementMasonryLayout;

