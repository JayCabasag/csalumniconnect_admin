import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import Post from './Post';


const MasonryLayout  = ({posts}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };

  
  return (
    
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <Post key={post.docId} post={post}/>
          })
      }

      
    </Masonry>
  )

}

export default MasonryLayout 

