import React, {useState, useEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from './Spinner';
import MasonryLayout from './MasonryLayout';
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import Modal from 'react-modal/lib/components/Modal';
import {IoIosCloseCircleOutline} from 'react-icons/io'
import { async } from '@firebase/util';
import { FaArrowLeft } from 'react-icons/fa';


const Feed = () => {
  
  const [uid, setUid] = useState(localStorage.getItem('uid'))
  const [usersInterests, setUsersInterests] = useState([])
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentLimit, setCurrentLimit] = useState(1000)

  const navigate = useNavigate();

useEffect(() => {
  setPosts([]);
  getAllPosts();
  getUsersInterests();
}, [])


  
  if(loading) return <Spinner message="We are adding Posts to your feed!"/>

  const getAllPosts = async () => {
    setLoading(true)
    const queryToOrder = query(collection(getFirestore(), "posts"), where('reviewed', '==', true),orderBy('ticks', 'desc'), limit(`${currentLimit}`));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"), orderBy("ticks"), orderBy("ticks", "desc"));
        querySnapshot.forEach((doc) => {
          setPosts((prev) => {
          return[...prev, doc.data()]
        });
        })
    setLoading(false)
  }

  const getUsersInterests = async () => {
    setLoading(true)
    const docRef = doc(getFirestore(), "users", `${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const checkIfInterestIsPresent = docSnap.data().interests;

      if(checkIfInterestIsPresent.length > 0){
        setUsersInterests(docSnap.data().interests);
      } else {
        
        const queryToOrder = query(collection(getFirestore(), "tags"), orderBy('discussion', 'desc'),  limit(10));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "tags"));
        
        const interestArray = [];

        querySnapshot.forEach((doc) => {
          interestArray.push(doc.data().tag);
        });
        
        setUsersInterests(interestArray)
      }    
    } else {
      
    }
    setLoading(false) 
  }



  return (
    <div>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
            <span>
              <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
            </span>
            <p className='font-bold text-slate-500'>
              Users posts
            </p>
      </div>  
      <MasonryLayout posts={posts} interests={usersInterests}/>
    </div>
  )
}

export default Feed
