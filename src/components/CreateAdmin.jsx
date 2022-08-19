import React, { useRef, useState } from 'react'
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, updateDoc} from "firebase/firestore"
import {  getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import { storage } from '../firebase-config';
import {BiImageAdd} from 'react-icons/bi'
import { Base64 } from 'js-base64'

const CreateAdmin = ({addedBy}) => {

  const [adminProfileImage, setAdminProfileImage] = useState("https://cdn.dribbble.com/users/5651948/screenshots/12721320/media/f37e46a901f7db41539aec21d7d9bbd9.gif")
  const [progress, setProgress] = useState(0)
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const confirmpasswordRef = useRef()
  const courseRef = useRef()

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [successAdminCreation, setSuccessAdminCreation] = useState(false)

  const onImageChange = (e) => {
      const image = e.target.files[0] 
      
      if(!image){
        return
      }
      const storageRef = ref(storage, `/files/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
            
            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
              (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress)
                switch (snapshot.state) {
                  case 'paused':
                    break;
                  case 'running':
                    break;
                }
              }, 
              (error) => {
                switch (error.code) {
                  case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                  case 'storage/canceled':
                    // User canceled the upload
                    break;
            
                  // ...
            
                  case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
                }
              }, 
              async () => {
                // Upload completed successfully, now we can get the download URL
                await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  setAdminProfileImage(downloadURL)
                });
              }
            );
  }

  const confirmAddAdmin = async () => {
    if(nameRef.current.value === ''){
      setError(true)
      setErrorMessage('Name field is empty')
      setSuccessAdminCreation(false)
      return
    } 
    if(emailRef.current.value === ''){
      setError(true)
      setErrorMessage('Email field is Empty')
      setSuccessAdminCreation(false)
      return
    }  
    if(passwordRef.current.value === ''){
      setError(true)
      setErrorMessage('Password field is Empty')
      setSuccessAdminCreation(false)
      return
    }  
    if(confirmpasswordRef.current.value === ''){
      setError(true)
      setErrorMessage('Confirm password field is empty')
      setSuccessAdminCreation(false)
      return
    } 
    if(courseRef.current.value === 'Not Set'){
      setError(true)
      setErrorMessage('Department/Course not set')
      setSuccessAdminCreation(false)
      return
    }

    if(passwordRef.current.value !== confirmpasswordRef.current.value){
      setError(true)
      setErrorMessage('Password did not match')
      setSuccessAdminCreation(false)
      return
    }
    
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(emailRef.current.value) ) {
      
      const displayName = nameRef.current.value
      const email = emailRef.current.value
      const password = passwordRef.current.value
      const confirmpassword = confirmpasswordRef.current.value
      const encryptedPassword = Base64.encode(confirmpassword)

      const docRef = doc(collection(getFirestore(), "admins"))
      const payload = {
        docId: docRef.id,
        addedBy: addedBy,
        department: courseRef.current.value,
        email: email,
        name: displayName,
        password: encryptedPassword,
        profileURL: adminProfileImage,
      }
      await setDoc(docRef, payload).then(
        //console.log(docRef.id)
      )
      setError(false)
      setErrorMessage('')
      setSuccessAdminCreation(true)
      nameRef.current.value = ""
      emailRef.current.value = ""
      passwordRef.current.value = ""
      confirmpasswordRef.current.value = ""
      courseRef.current.value = "Not Set"
      setAdminProfileImage("https://cdn.dribbble.com/users/5651948/screenshots/12721320/media/f37e46a901f7db41539aec21d7d9bbd9.gif")
    }
      else {
        setError(true)
        setErrorMessage('Email is invalid')
        setSuccessAdminCreation(false)
      }  

  }

  return (
    <div className='flex flex-col w-full justify-center p-2 gap-y-2 items-center'>
      
      <img src={adminProfileImage} alt="admin" width={180} />
  
        <p className='text-xs text-slate-400'>Uploaded {progress}%</p>

      <label htmlFor="file" className='bg-rose-500 py-2 px-10 cursor-pointer rounded-md text-white hover:bg-rose-600'>Upload Image</label>
      <input type="file" id='file' className='hidden'  onChange={onImageChange} accept='image/png, image/jpeg, image/jpg, image/gif'/>
      
      <div className='w-full md:w-1/2 flex flex-col gap-y-2 justify-center'>
        <p className='text-slate-500 font-bold py-2'>Admin Details</p>
        <input ref={nameRef} type='text' placeholder='Full name' className='p-2 outline-none border rounded-sm text-slate-500'/>
        <input ref={emailRef} type='email' placeholder='Email' className='p-2 outline-none border rounded-sm text-slate-500' />
        <input ref={passwordRef} type='password' placeholder='Password' className='p-2 outline-none border rounded-sm text-slate-500' />
        <input ref={confirmpasswordRef} type="password"  placeholder='Re-enter password' className='p-2 outline-none border rounded-sm text-slate-500' />
                    <select ref={courseRef} defaultValue={'Not Set'} className="outline-none  border p-2 rounded-md  cursor-pointer text-slate-500">
                      <option value="Not Set">Not Set</option>
                      <option value="REGISTRAR">REGISTRAR</option>
                      <option value="ACT-CTT">ACT-CTT</option>
                      <option value="ACT-PTECH-UI/UXT">ACT-PTECH-UI/UXT</option>
                      <option value="BSIS">BSIS</option>
                      <option value="BSCS">BSCS</option>
                      <option value="BET-ELEXT">BET-ELEXT</option>
                      <option value="BET-ELEC">BET-ELEC</option>
                      <option value="BSCIVE-SE">BSCIVE-SE</option>
                      <option value="BSCIVE-TE">BSCIVE-TE</option>
                      <option value="BSCIVE">BSCIVE</option>
                      <option value="BSIT-AUTO">BSIT-AUTO</option>
                      <option value="BSIT-ELEC">BSIT-ELEC</option>
                      <option value="BSIT-ELEXT">BSIT-ELEXT</option>
                      <option value="BSIE">BSIE</option>
                      <option value="BEED">BEED</option>
                      <option value="BPED">BPED</option>
                      <option value="BPA">BPA</option>
                      <option value="BSBA-HRDM">BSBA-HRDM</option>
                      <option value="BSBA-MM">BSBA-MM</option>
                      <option value="BSBM">BSBM</option>
                      <option value="BSCRIM">BSCRIM</option>
                      <option value="BSEM">BSEM</option>
                      <option value="BSHM">BSHM</option>
                      <option value="BSHRM">BSHRM</option>
                      <option value="BSMM">BSMM</option>
                      <option value="BSME">BSME</option>
                      <option value="BSOA">BSOA</option>
                      <option value="BSOM">BSOM</option>
                      <option value="BSPSY">BSPSY</option>
                      <option value="BSSW">BSSW</option>
                      <option value="BSTM">BSTM</option>
                      <option value="BSE-SCI">BSE-SCI</option>
                      <option value="BSE-ENG">BSE-ENG</option>
                      <option value="BSE-MATH">BSE-MATH</option>
                      <option value="MBA">MBA</option>
                      <option value="MPA">MPA</option>
                      <option value="MAED">MAED</option>
                      <option value="MSCJ">MSCJ</option>
                      <option value="EES">EES</option>                     
                    </select>

        {
          error?
          <p className='w-full text-rose-500 text-center text-xs'>{errorMessage}</p>
          :
          null
        }

        {
          successAdminCreation?
          <p className='text-green-700 text-center text-xs'>Admin Created Successfully</p>
          :
          null
        }

        <button className='bg-rose-500 py-2 text-white rounded-md' onClick={()=>{confirmAddAdmin()}}>Add New Admin</button>
      </div>
    </div>
  )
}

export default CreateAdmin