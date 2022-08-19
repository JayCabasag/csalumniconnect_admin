import React, {useRef, useState} from 'react'
import {  Link, useNavigate } from 'react-router-dom';
import { getFirestore, query, where, collection , getDocs, setDoc, doc, getDoc, limit} from 'firebase/firestore';
import { Base64 } from 'js-base64';

const Login = () => {

  const logo ='https://firebasestorage.googleapis.com/v0/b/cs-alumni-connect.appspot.com/o/images%2Fcs_allumni_logo.2.png?alt=media&token=7a7fca12-0eeb-4182-9340-7563123b9ffd'

  const emailRef = useRef();
  const passwordRef = useRef();
  const [user, setUser] = useState([])

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  

  const login = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if(email === '' || password === '') {
      setErrorMessage('Some fields are Empty');
      setError(true);
      setSuccess(false)
      return;
    }


   try{
    const encryptedPassword = Base64.encode(password)

    const queryToOrder = query(collection(getFirestore(), "admins"), where("email", "==",`${email}`), where("password", "==", `${encryptedPassword}`), limit(1));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "admins"));

      var returnArr = [];
      querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr.push(item);
      })

     setUser(returnArr)

     if(returnArr.length === 0){
       setError(true)
       setErrorMessage('Admin credentials is incorrect!')
     } else {

      localStorage.setItem('name', returnArr[0].name)
      localStorage.setItem('email', returnArr[0].email)
      localStorage.setItem('uid', returnArr[0].docId)
      localStorage.setItem('displayName', returnArr[0].name)
      localStorage.setItem('photoURL', returnArr[0].profileURL)
      localStorage.setItem('AdminDepartment', returnArr[0].department)

      setError(false)
      setErrorMessage('')

      navigate('/')
     }

    } catch (error) {
      setErrorMessage(error.code)
      setError(true)
    }

  }

  return (
    <div className='px-4 flex w-screen h-screen justify-center items-center'>
      <div className='pb-10 p-5 h-auto w-screen md:w-2/5 lg:w-1/4 border-2 rounded-md bg-white pt-10'>
         
        <form className='space-y-5 w-full h-full flex flex-col justify-center items-center'
          onSubmit={login}
          >
            <img src={logo} alt='tcuhub' width={200}/>      
            {
              error && <p className='text-rose-500'>{errorMessage}</p>
            }
          <input type="email" placeholder="E-mail" ref={emailRef} className='text-slate-400 px-2 text-16 leading-10 w-full border outline-none'/>
          <input type="password" placeholder="Password" ref={passwordRef} className='text-slate-400 text-gray px-2 text-16 leading-10 w-full border outline-none'/>
          <button 
            className='w-full bg-fuchsia-500 rounded py-3 text-white '
            disabled={loading}
            type="submit"
            >Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login