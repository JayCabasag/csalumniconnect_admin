import React, {useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import CreateAdmin from './CreateAdmin'
import {MdClose} from 'react-icons/md'
import ChangeAdminPassword from './ChangeAdminPassword'

const AdminProfile = () => {

 const {uid} = useParams() 
 const navigate = useNavigate()

 const [adminProfileImage, setAdminProfileImage] = useState('https://cdn.dribbble.com/users/5651948/screenshots/12721320/media/f37e46a901f7db41539aec21d7d9bbd9.gif')
 const [adminProfileName, setAdminProfileName] = useState('Please wait...')
 const [adminProfileCourse, setAdminProfileCourse] = useState('Please wait...')

 const [createNewAdmin, setCreateNewAdmin] = useState(false)
 const [changePasswordBox, setChangePasswordBox] = useState(false)

 useEffect(() => {
    getAdminDetails()
 }, [])


 const getAdminDetails = async () => {

  const docRef = doc(getFirestore(), "admins", `${uid}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
      
      setAdminProfileImage(docSnap.data().profileURL)
      setAdminProfileName(docSnap.data().name)
      setAdminProfileCourse(docSnap.data().department) 

  } else {
      console.log('User does not exist' + uid)
  }
   
 }
 

 const logOut = () => {
    
    localStorage.clear()
    navigate('/login')

 }

  return (
    <div className='flex flex-col gap-y-1 mt-2 rounded-md justify-center'>

    <div className='w-full flex text-slate-500 items-center bg-white p-2 rounded-md cursor-pointer' onClick={()=>{navigate('/')}} ><FaArrowLeft className='m-1'/> <p className='p-1 font-bold'>Admin Profile</p></div>

        <div className='flex'>
          <img src={adminProfileImage} alt="admin" width={120} className="p-1 rounded-md"/>
          <div className='flex flex-col'>
                <p className='font-bold text-slate-600 p-1 text-lg'>{adminProfileName}</p>
                <p className='font-mono text-slate-500 text-sm pl-1'>Department/Course: {adminProfileCourse}</p>

                {
                  changePasswordBox?
                  null
                  :
                  <button className='p-1 bg-fuchsia-700 m-1 text-white px-2 rounded-md text-xs cursor-pointer' onClick={()=> {setChangePasswordBox(true)}}>Change Password</button>
                }

                {
                  createNewAdmin?
                  null
                  :
                  <button className='p-1 bg-fuchsia-700 m-1 text-white px-2 rounded-md text-xs cursor-pointer' onClick={()=> {setCreateNewAdmin(true)}}>Create New Admin</button>
                }

               
                
          </div>
        </div>
          {
            changePasswordBox?
            <div className='w-full flex-col items-center justify-center px-1 rounded'>
              <div className='flex items-center font-bold text-slate-500 bg-fuchsia-500'>

              <MdClose onClick={() => {setChangePasswordBox(false)}} className='cursor-pointer h-8 w-8 p-1 text-white font-bold' />
              
              <p className='text-white py-2'>Change Password</p>
              </div>
              <ChangeAdminPassword adminId={uid}/>
            </div>
            :
            null
          }

          {
            createNewAdmin?
            <div className='w-full flex-col items-center justify-center px-1 rounded'>
              <div className='flex items-center font-bold text-slate-500 bg-fuchsia-500'>

              <MdClose onClick={() => {setCreateNewAdmin(false)}} className='cursor-pointer h-8 w-8 p-1 text-white font-bold' />

              
              <p className='text-white py-2'>Create Admin</p>
              </div>
              <CreateAdmin addedBy={uid}/>
            </div>
            :
            <button className='bg-fuchsia-700 text-white p-2 mx-1' onClick={() => {logOut()}}>Log Out</button>
          }


       
    </div>
  )
}

export default AdminProfile