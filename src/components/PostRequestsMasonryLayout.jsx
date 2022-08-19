import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import PostRequest from './PostRequest';

const AnnouncementMasonryLayout  = ({posts}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };
  
  return (
    
    <Masonry className="flex animate-slide-fwd w-full" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <PostRequest key={post.docId} post={post}/>
          })
      }
      
    </Masonry>
  )

}

export default AnnouncementMasonryLayout;

