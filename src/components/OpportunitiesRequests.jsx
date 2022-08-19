import React, { useState, useEffect } from 'react'
import {FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import Spinner from './Spinner';
import OpportunityRequestsMasonryLayout from './OpportunityRequestsMasonry'


const OpportunitiesRequests = () => {

  const [opportunitiesRequests, setOpportunitiesRequests] = useState([])
  const [loading, setLoading] = useState(false)

    useEffect(() => {
      GetAllOpportunitiesRequests();
    }, [])
    
  const GetAllOpportunitiesRequests = async () => {
    setLoading(true)
    setOpportunitiesRequests([])
    const queryToOrder = query(collection(getFirestore(), "opportunities"), where('reviewed', '==', false), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "opportunities"));
        querySnapshot.forEach((doc) => {
          setOpportunitiesRequests((prev) => {
          return[...prev, doc.data()]
        });
    })
    setLoading(false)
  }

    const navigate = useNavigate();
  
    return (
      <div className='w-full flex flex-col gap-y-1'>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
          <span>
            <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
          </span>
          <p className='font-bold text-slate-500'>
            Opportunities Requests
          </p>
     </div>
     
     {
        loading === true?
        <Spinner />
        :
          <div className='flex w-full justify-center items-center py-2 text-sm text-slate-500'>
          {
            opportunitiesRequests.length === 0?
            <p>No pending posts request. Please check later</p>
            :
            <OpportunityRequestsMasonryLayout posts={opportunitiesRequests} />
          }
          </div>
      }



    </div>
    )
  
}

export default OpportunitiesRequests