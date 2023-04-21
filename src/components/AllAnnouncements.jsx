import React, { useEffect, useState } from 'react'
import { getFirestore, collection, getDocs, orderBy, query, limit } from "firebase/firestore"
import 'react-confirm-alert/src/react-confirm-alert.css';
import AnnouncementMasonryLayout from './AnnouncementMasonryLayout'
import Spinner from './Spinner'

const AllAnnouncements = () => {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const currentLimit = 100

  useEffect(() => {
    const GetAllAnnouncements = async () => {
      setLoading(true)
      const queryToOrder = query(collection(getFirestore(), "announcements"), orderBy('ticks', 'asc'), limit(`${currentLimit}`));

      const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "announcements"), orderBy("ticks"), orderBy("ticks", "desc"));
          querySnapshot.forEach((doc) => {
            setAnnouncements((prev) => {
            return[...prev, doc.data()]
          });
          })
      setLoading(false)
    }
    GetAllAnnouncements()
  }, [currentLimit])    
    if(loading) return <Spinner message="We are adding Posts to your feed!"/>

    return (
      <div>  
          <AnnouncementMasonryLayout posts={[]}/>
      </div>
    )
}

export default AllAnnouncements