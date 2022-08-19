import React, {useEffect, useState} from 'react'
import {FaArrowLeft } from 'react-icons/fa'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, deleteDoc} from "firebase/firestore"
import EmploymentCategory from './EmploymentCategory'


const SystemSettings = () => {
  
  const navigate = useNavigate();
  const [allFoulWords, setAllFoulWords] = useState([])
  const [foulWordToAdd, setFoulWordToAdd] = useState('')

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getAllFoulWords();
  }, [])
  
  const getAllFoulWords = async () => {

    setAllFoulWords([])

    const querySnapshot = await getDocs(collection(getFirestore(), "foulwords")); 
    var returnArr = [];

    querySnapshot.forEach((doc) => {
      returnArr.push(doc.data());
    })

    setAllFoulWords(returnArr)
  }



  const addFoulWord = async () => {

    if(foulWordToAdd === ''){
        setError(true)
        setSuccess(false)
        setErrorMessage('Make sure field is not empty!')
        return
    }

    const docRef = doc(collection(getFirestore(), "foulwords"))
      const payload = {
        docId: docRef.id,
        foulword: foulWordToAdd
      }
      await setDoc(docRef, payload).then(
        //console.log(docRef.id)
      )
    setError(false)
    setSuccess(true)
    setErrorMessage('Foul word added successfully')
    setFoulWordToAdd('')
    getAllFoulWords()
  }

  const deleteFoulWord = async (value) => {
    await deleteDoc(doc(getFirestore(), "foulwords", `${value}`));
    getAllFoulWords()
  }

  return (
    <div className='w-full flex flex-col gap-y-1'>
    <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
        <span>
          <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>navigate('/')}/>
        </span>
        <p className='font-bold text-slate-500'>
          System Settings
        </p>
      </div>

      <div className='flex w-full flex-col bg-white rounded-md shadow'>
            <p className='p-2 text-slate-500'>List of Foul Words</p>
            <div className='w-full'>
               <ul className='px-2 flex w-full flex-wrap h-auto gap-2 items-center justify-center'>

                        {
                            allFoulWords.length === 0?
                            <p className='text-slate-500'>No foulwords added.</p>
                            :
                            null
                        }
                        {
                            allFoulWords.map((foulword) => {
                                return <li className='p-2 border rounded-md w-max flex justify-center items-center gap-x-2' key={foulword.docId}><span >{foulword.foulword}</span> <RiDeleteBack2Line className='hover:text-rose-500 cursor-pointer' onClick={() => {deleteFoulWord(foulword.docId)}} /></li>
                            })
                        }
                    </ul>  
            </div>
            
            <div className='flex flex-col justify-center items-center py-5 gap-x-2'>
                <div className='flex w-full justify-center items-center'>  
                   <input className='text-slate-500 border rounded-sm px-2 py-2 outline-none' type="text" placeholder='foul word' value={foulWordToAdd} onChange={(e) => {setFoulWordToAdd(e.target.value)}}/>
                  <button className='border rounded-md px-5 py-2 text-fuchsia-700 hover:bg-fuchsia-700 hover:text-white' onClick={() => {addFoulWord()}}>Add</button>
                </div>
                <div className='flex w-full justify-center items-center py-2'>
                {
                    error?
                    <p className='text-rose-500'>{errorMessage}</p>
                    :
                    null
                }

                {
                        success?
                        <p className='text-green-500'>{errorMessage}</p>
                        :
                        null
                }
                </div>
              </div>
      </div>

      <EmploymentCategory />

  </div>
  )
}

export default SystemSettings