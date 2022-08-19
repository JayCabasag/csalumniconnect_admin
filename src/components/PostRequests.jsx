import React, { useState, useEffect } from 'react'
import {FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import PostRequestsMasonry from './PostRequestsMasonryLayout'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import Spinner from './Spinner';

const PostRequests = () => {

  const [postRequests, setPostRequests] = useState([])
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      GetAllPostRequests();
    }, [])
    
  const GetAllPostRequests = async () => {
    setLoading(true)
    setPostRequests([])
    const queryToOrder = query(collection(getFirestore(), "posts"), where('reviewed', '==', false), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "posts"));
        querySnapshot.forEach((doc) => {
          setPostRequests((prev) => {
          return[...prev, doc.data()]
        });
    })
    setLoading(false)
  }


  const goBack = () => {
        navigate('/')
  }
  return (
    <div className='w-full flex flex-col gap-y-1'>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
          <span>
            <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>goBack()}/>
          </span>
          <p className='font-bold text-slate-500'>
            Post requests
          </p>
        </div>
        



      {
        loading === true?
        <Spinner />
        :
          <div className='flex w-full justify-center items-center py-2 text-sm text-slate-500'>
          {
            postRequests.length === 0?
            <p>No pending posts request. Please check later</p>
            :
            <PostRequestsMasonry posts={postRequests} />
          }
          </div>
      }


    </div>
  )
}

export default PostRequests