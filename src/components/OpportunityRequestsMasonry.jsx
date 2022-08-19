import React, {useEffect, useState} from 'react'
import Masonry from 'react-masonry-css';
import OpportunityRequest from './OpportunityRequest';

const OpportunityRequestsMasonryLayout  = ({posts}) => {
  
  const breakpointColumnsObj = {
    default: 1,
  };

  console.log(posts)
  
  return (
    
    <Masonry className="flex animate-slide-fwd w-full" breakpointCols={breakpointColumnsObj}>
  
      {
          posts.map((post)=>{
            return <OpportunityRequest key={post.docId} post={post}/>
          })
      }
      
    </Masonry>
  )

}

export default OpportunityRequestsMasonryLayout;

