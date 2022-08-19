import React, { useRef, useState } from 'react'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query,getDoc, where, updateDoc, limit} from "firebase/firestore"
import { Base64 } from 'js-base64'
import { async } from '@firebase/util'

const ChangeAdminPassword = ({adminId}) => {
    
    const oldPassword = useRef()
    const newPassword = useRef()
    const confirmNewPassword = useRef()

    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const resetPassword = async () => {

        if(oldPassword.current.value === '' || newPassword.current.value === '' || confirmNewPassword === ''){
            setError(true)
            setErrorMessage('Some fields are empty')
            return
        } 
        if(newPassword.current.value !== confirmNewPassword.current.value){
            setError(true)
            setErrorMessage('New Password not matched!')
            return
        }

        getCurrentAdminPassword()
        
    }

    const getCurrentAdminPassword = async () => {
        
        const adminRef = doc(getFirestore(), "admins", `${adminId}`);
        const docSnap = await getDoc(adminRef);

        if(docSnap.exists()){  
            const pass = docSnap.data().password
            const encryptedPassword = Base64.encode(oldPassword.current.value)
            if (pass != encryptedPassword){
                setError(true)
                setErrorMessage('Old Password do not match!')
                setSuccess(false)
            } else {
                confirmResetPassword()
            }
        } else {
            console.log('Docs does not exists')
        }

    }

    const confirmResetPassword = async() => {
        const adminRef = doc(getFirestore(), "admins", `${adminId}`);
        const docSnap = await getDoc(adminRef);
    
        if(docSnap.exists()){  
          await updateDoc(adminRef, {
            password: Base64.encode(confirmNewPassword.current.value)
          });
        } else {
          console.log('Docs does not exists')
        }

        setError(false)
        setErrorMessage('')
        setSuccess(true)
    }
  
    return (
    <div className='flex w-full justify-center p-2 py-8'>
        <div className='w-full md:w-2/5 gap-y-1 flex  flex-col'>
            <input type="password" ref={oldPassword} placeholder='Old password' className='outline-none border p-2 w-full text-slate-500 rounded'/>
            <input type="password" ref={newPassword} placeholder='New password' className='outline-none border p-2 w-full text-slate-500 rounded'/>
            <input type="password" ref={confirmNewPassword} placeholder='Confirm new password' className='outline-none border p-2 w-full text-slate-500 rounded'/>

            {
                error?
                <p className='w-full text-rose-500 text-center text-xs'>{errorMessage}</p>
                :
                null
            }

            {
                success?
                <p className='text-green-700 text-center text-xs'>Password reset Successfully</p>
                :
                null
            }
            <button className='w-full bg-rose-500 p-3 text-white rounded' onClick={()=>{resetPassword()}}>Reset Password</button>
        </div>
    </div>
  )
}

export default ChangeAdminPassword