import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {FaArrowLeft } from 'react-icons/fa'
import {doc, getFirestore, deleteDoc, where, collection, getDocs, getDoc, orderBy, query, limit, documentId, exists, updateDoc, Timestamp, setDoc, addDoc, serverTimestamp, increment} from "firebase/firestore"
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';
import AnnouncementMasonryLayout from './AnnouncementMasonryLayout'
import Spinner from './Spinner'

const AllAnnouncements = () => {

  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const [usersInterests, setUsersInterests] = useState([])
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [currentLimit, setCurrentLimit] = useState(100)

  const navigate = useNavigate();

  useEffect(() => {
    GetAllAnnouncements()
  }, [])


    
    if(loading) return <Spinner message="We are adding Posts to your feed!"/>

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


    return (
      <div>  
          <AnnouncementMasonryLayout posts={announcements}/>
        {/* Modal for Getting users Interests */}

      </div>
    )
}

export default AllAnnouncements