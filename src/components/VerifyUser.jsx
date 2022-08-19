import React, {useState, useRef, useEffect} from 'react'
import {useNavigate, useParams } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"


const VerifyUser = () => {
    
    const { userId } = useParams();
    const navigate = useNavigate();

    const [selectedUserToVerify, setselectedUserToVerify] = useState(userId)
    const [accountToVerifyName, setAccountToVerifyName] = useState('UserName')
    const [accountToVerifyProfileImage, setAccountToVerifyProfileImage] = useState('https://i.pinimg.com/originals/2b/02/15/2b02159fee58d573c079ad5212d56b63.gif')
    const courseRef = useRef()
    const yearRef = useRef()
    const studentIdRef = useRef()
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [userType, setUserType] = useState('Alumni')
    const [alumniBatch, setAlumniBatch] = useState('')
    const [faculty, setFaculty] = useState('')
    const [yearSection, setYearSection] = useState('')

    useEffect(() => {
      GetUserDetails(userId);
    }, [])
    
    const GetUserDetails = async (userId) => {
        
        const userRef = doc(getFirestore(), "users", `${userId}`);
        const docSnap = await getDoc(userRef);
    
            if (docSnap.exists()) {
                setAccountToVerifyProfileImage(docSnap.data().image)
                setAccountToVerifyName(docSnap.data().displayName)
                setUserType(docSnap.data().role)
                setFaculty(docSnap.data().faculty)
                setYearSection(docSnap.data().yearSection)
                setAlumniBatch(docSnap.data().batch)
            } else {
            console.log("No such document!");
            }
    }

    const goBack = () => {
        navigate('/category/Account-Requests')
    }

    // const verifyNow = (docId, displayName, image) => {
    
    //     setselectedUserToVerify(docId)
    //     setAccountToVerifyName(displayName)
    //     setAccountToVerifyProfileImage(image)
    
    //   }
    
      const verifyUser = async () =>{

        if(userType === 'CS Student'){
          const docsRef = doc(getFirestore(), "users", `${selectedUserToVerify}`);
          const docSnap = await getDoc(docsRef);
      
          if(docSnap.exists()){  
            await updateDoc(docsRef, {
              role: userType,
              yearSection: yearSection,
              verified: true
            }); } 
          else {
              alert('User does not exist')
          }
    
          setError(false)
          setErrorMessage('')

          alert('Role given to ' + accountToVerifyName + " as "+ userType)
          cancel()

          return
        }

        if(userType === 'Professor'){
          const docsRef = doc(getFirestore(), "users", `${selectedUserToVerify}`);
          const docSnap = await getDoc(docsRef);
      
          if(docSnap.exists()){  
            await updateDoc(docsRef, {
              role: userType,
              faculty: faculty,
              verified: true
            }); } 
          else {
              alert('User does not exist')
          }
    
          setError(false)
          setErrorMessage('')

          alert('Role given to ' + accountToVerifyName + " as "+ userType)
          cancel()

          return
        }

        const docsRef = doc(getFirestore(), "users", `${selectedUserToVerify}`);
          const docSnap = await getDoc(docsRef);
      
          if(docSnap.exists()){  
            await updateDoc(docsRef, {
              role: userType,
              batch: alumniBatch,
              verified: true
            }); } 
          else {
              alert('User does not exist')
          }
    
          setError(false)
          setErrorMessage('')

          alert('Role given to ' + accountToVerifyName + " as "+ userType)
          cancel()
        }

    
      const cancel = () => {
        setselectedUserToVerify(null)
        setAccountToVerifyName(null)
        setAccountToVerifyProfileImage(null)
        setError(false)
        setErrorMessage('')
        navigate('../category/Account-Requests')
      }

    return (
    <div>
        <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
        <span>
          <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>goBack()}/>
        </span>
        <p className='font-bold text-slate-500'>
          Verify user
        </p>
        </div>
        <div className='flex flex-col items-center justify-center border mt-2 rounded bg-white p-2'>
        
          <div className='flex flex-col mt-5 w-full'>

           <div className='flex flex-col justify-center text-slate-500 gap-y-1 items-center'>
                
                <img src={accountToVerifyProfileImage} alt="user" width={250} className="border rounded-full" />
                
                <div className='flex flex-col p-1'>
                    <p className='mx-1 text-center font-bold text-xl capitalize'>{accountToVerifyName}</p>
                  <p className='mx-1  text-center '>{selectedUserToVerify}</p>  
                  
                  <p className='font-bold py-2 text-fuchsia-700'>Role({userType}):</p>
                  <div className='flex flex-row justify-center space-x-1 mt-2'>
                    {
                        userType === 'Alumni'?
                        <button className='border p-1 px-2 rounded-md bg-fuchsia-700 text-white' onClick={() => setUserType('Alumni')}>Alumni</button>
                        :
                        <button className='border p-1 px-2 rounded-md' onClick={() => setUserType('Alumni')}>Alumni</button>
                    }
                    {
                        userType === 'CS Student'?
                        <button className='border p-1 px-2 rounded-md bg-fuchsia-700 text-white' onClick={() => setUserType('CS Student')}>CS Student</button>
                        :
                        <button className='border p-1 px-2 rounded-md' onClick={() => setUserType('CS Student')}>CS Student</button>
                    }

                    {
                        userType === 'Professor'?
                        <button className='border p-1 px-2 rounded-md bg-fuchsia-700 text-white' onClick={() => setUserType('Professor')} >Professor</button>
                        :
                        <button className='border p-1 px-2 rounded-md' onClick={() => setUserType('Professor')} >Professor</button>
                    }
                  </div>
                  <div>
                    {
                        userType === 'Alumni'?
                        <div className='flex justify-center items-center p-2 gap-x-2 '>
                          <p>Batch : </p>
                          <input type="text" name="" id="" defaultValue={alumniBatch} onChange={(e) => {setAlumniBatch(e.target.value)}} className='border outline-none p-1'/>
                        </div>
                        :
                        null
                      }

                      {
                        userType === 'CS Student'?
                        <div className='flex justify-center items-center p-2 gap-x-2 '>
                          <p>Yr & Sect. : </p>
                          <input type="text" name="" id="" defaultValue={yearSection} onChange={(e) => {setYearSection(e.target.value)}}className='border outline-none p-1'/>
                        </div>
                        :
                        null
                      }

                      {
                        userType === 'Professor'?
                        <div className='flex justify-center items-center p-2 gap-x-2'>
                          <p>Faculty : </p>
                          <input type="text" name="" id="" defaultValue={faculty} onChange={(e) => {setFaculty(e.target.value)}} className='border outline-none p-1'/>
                        </div>
                        :
                        null
                      }
                  </div>
                </div> 
           </div>


           <button className='mt-5 w-full bg-fuchsia-700  p-2 text-white rounded-md hover:bg-fuchsia-600' onClick={() => {verifyUser()}}>Verify Account</button>

           <button className='w-full text-slate-500 p-2 rounded-md' onClick={() => {cancel()}}>Cancel</button>

          </div>
        </div>

    </div>
  )
}

export default VerifyUser