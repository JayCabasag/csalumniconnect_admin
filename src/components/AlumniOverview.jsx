import React, {useEffect, useState} from 'react'
import { getFirestore, where, collection, getDocs, query} from "firebase/firestore"

const AlumniOverview = () => {
  
  const [numberOfAlumni, setNumberOfAlumni] = useState(999)
  const [numberOfEmployedAlumni, setNumberOfEmployedAlumni] = useState(999)
  const [numberOfUnemployedAlumni, setNumberOfUnemployedAlumni] = useState(999)
  const [numberOfDidNotProvide, setNumberOfDidNotProvide] = useState(999)

  useEffect(() => {
    getAllAlumni();
    getEmployedAlumni();
    getUnemployedAlumni();
    getRatherNotSayAlumni();
  }, [])

  const getAllAlumni = async () => {
    const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("verified", "==",true));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    setNumberOfAlumni(returnArr.length)

  }

  const getEmployedAlumni = async () => {
    const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Employed"),  where("verified", "==",true));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    setNumberOfEmployedAlumni(returnArr.length);
  }

  const getUnemployedAlumni = async () => {
    const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Unemployed"),  where("verified", "==",true));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    setNumberOfUnemployedAlumni(returnArr.length)
  }

  const getRatherNotSayAlumni = async () => {
    const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Rather not say"),  where("verified", "==",true));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    setNumberOfDidNotProvide(returnArr.length)
  }
  
  

  
  return (
    <div className='p-2 w-full'>
      <p className='text-center font-bold p-5 text-fuchsia-700'>Alumni Overview</p>

      <div className='flex flex-grow-4 justify-center items-center'>
          <div className='w-full flex flex-col items-center justify-center bg-fuchsia-700 p-2'>
          <p className='font-bold text-white'>Alumni Users</p>
          <p className='font-bold text-white'>{numberOfAlumni}</p>
          </div>
          <div className='w-full flex flex-col items-center justify-center bg-fuchsia-700 p-2'>
          <p className='font-bold text-white'>Employed</p>
          <p className='font-bold text-white'>{numberOfEmployedAlumni}</p>
          </div>
          <div className='w-full flex flex-col items-center justify-center bg-fuchsia-700 p-2'>
          <p className='font-bold text-white'>Unemployed</p>
          <p className='font-bold text-white'>{numberOfUnemployedAlumni}</p>
          </div>
            
          <div className='w-full flex flex-col items-center justify-center bg-fuchsia-700 p-2'>
          <p className='font-bold text-white'>Didn't provide</p>
          <p className='font-bold text-white'>{numberOfDidNotProvide}</p>
          </div>
      </div>

      <p className='text-xs text-rose-500 py-1'>Note:  users that aren't verified are not included</p>
    </div>
  )
}

export default AlumniOverview