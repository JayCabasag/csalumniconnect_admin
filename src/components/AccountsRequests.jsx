import React, {useEffect, useRef, useState} from 'react'
import {FaArrowLeft} from 'react-icons/fa'
import Modal from 'react-modal/lib/components/Modal';
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import { useNavigate } from 'react-router-dom';

const AccountsRequests = () => {

  const navigate = useNavigate()

  const [accountRequests, setAccountRequests] = useState([])

  useEffect(() => {
    getAllAccountRequests();
  }, [])

  const getAllAccountRequests = async () => {
    
    const queryToOrder = query(collection(getFirestore(), "users"), where("verified", "==", false), orderBy('displayName', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var docId = doc.id
      var item = doc.data();
      item['docId'] = docId;
      returnArr.push(item);
    })

    setAccountRequests(returnArr);
  }
  
  const [selectedUserToVerify, setselectedUserToVerify] = useState('userid123245451')
  const [accountToVerifyName, setAccountToVerifyName] = useState('UserName')
  const [accountToVerifyProfileImage, setAccountToVerifyProfileImage] = useState('https://i.pinimg.com/originals/2b/02/15/2b02159fee58d573c079ad5212d56b63.gif')

  const [modalForVerification, setModalForVerification] = React.useState(false);

  const courseRef = useRef()
  const yearRef = useRef()
  const studentIdRef = useRef()


  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  
  const verifyNow = (docId, displayName, image) => {
    
    setselectedUserToVerify(docId)
    setAccountToVerifyName(displayName)
    setAccountToVerifyProfileImage(image)

    setModalForVerification(true)
  }

  const verifyUser = async () =>{
    
    const studentCourse = courseRef.current.value
    const studentYear = yearRef.current.value
    const studentIdData = studentIdRef.current.value

    if(studentCourse === 'Not Set' || studentYear === 'Not Set' || studentIdData === ''){
      setError(true)
      setErrorMessage('Some field is empty')
    } else {
      
      const docsRef = doc(getFirestore(), "users", `${selectedUserToVerify}`);
      const docSnap = await getDoc(docsRef);
  
      if(docSnap.exists()){  
        await updateDoc(docsRef, {
          course: studentCourse,
          year: studentYear,
          studentId: studentIdData,
          verified: true

        }); } 
      else {
          alert('User does not exist')
      }

      setError(false)
      setErrorMessage('')
      getAllAccountRequests()
      setModalForVerification(false)
    }
   
  }

  const cancel = () => {

    setselectedUserToVerify(null)
    setAccountToVerifyName(null)
    setAccountToVerifyProfileImage(null)

    
    setError(false)
    setErrorMessage('')
    setModalForVerification(false)
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
            Account requests
          </p>
        </div>
      {
        accountRequests.map((request) => {
          return <div className='w-full flex bg-white p-1 rounded items-center border px-3'>
                      <img src={request.image} alt="" width={50} className="border rounded-full "/>
                      <div>
                      <p className='font-bold px-1 text-slate-500 '>{request.displayName} ({request.role})</p>
                      <p className='italic text-slate-500 text-xs'>ID : {request.docId}</p>
                      </div>
                      
                      <button className='border py-2 bg-fuchsia-700 text-white rounded-md ml-auto px-3' onClick={() => {navigate(`../account-verification/${request.docId}`)}}>Verify user</button>
              
                    </div>
        })
      }

      <div className='flex w-full justify-center items-center py-2 text-sm text-slate-500'>
      {
        accountRequests.length === 0?
        <p>No pending account request. Please check later</p>
        :
        null
      }
      </div>
    </div>
  )
}

export default AccountsRequests