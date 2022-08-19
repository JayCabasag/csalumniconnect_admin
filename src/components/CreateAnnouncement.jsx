import React, { useState, useRef, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, updateDoc, serverTimestamp, increment} from "firebase/firestore"
import {  getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import { storage } from '../firebase-config';
import {BsFileEarmarkPost, BsCardImage, BsCameraVideo} from 'react-icons/bs'
import {BiImageAdd} from 'react-icons/bi'
import '../index.css'
import Modal from 'react-modal/lib/components/Modal';


const Announcements = () => {

      const navigate = useNavigate();
      const [postType, setPostType] = useState('post');
      const [progress, setProgress] = useState(0)
      const [urls, setUrls] = useState([])
      const [title, setTitle] = useState('')
      const [description, setDescription] = useState('')
      const [links, setLinks] = useState('')
      const [tags, setTags] = useState('')
      const [video, setVideo] = useState('')
      const [error, setError] = useState(false)
      const [errorMessage, setErrorMessage] = useState('')
      const uid = localStorage.getItem('uid');
      const announcementTypeRef = useRef()
      const [allUsersUid, setallUsersUid] = useState([])

      useEffect(() => {
        GetAllUsersUid();
      }, [])

      const GetAllUsersUid = async () => {

        const queryToOrder = query(collection(getFirestore(), "users"), where("verified", "==", true))

        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
        
        querySnapshot.forEach((doc) => {

          var docId = doc.id
          var item = doc.data();
          item['docId'] = docId;
          setallUsersUid((prev) => {
          return[...prev, item]
        });
        })

      }

      const [modalIsOpen, setModalIsOpen] = React.useState(false);

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


      function closeModal() {
        setModalIsOpen(false);
        navigate('/');
      }

  


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
                      setUrls([...urls, downloadURL])
                    });
                  }
                );

      }

      const removeImage = (e) => {
          const imageToDelete = e.target.src;
          const newArray = urls.filter((item) => item !== imageToDelete)
          setUrls(newArray)
      }

      const handleSetTitle = (e) => {
          setTitle(e.target.value)
    
      }

      const handleSetDescription = (e) =>{
          setDescription(e.target.value)
      
      }

      const handleSetLinks = (e) => {
        setLinks(e.target.value)
      
      }

      const handleSetTags = (e) => {
          setTags(e.target.value)
          
      }

      const handleSetVideo = (e) => {
          setVideo(e.target.value)
      }
      

      const handleSubmit = () => {

        if(postType === 'post'){
            
              if(title === '' || description === ''){
                setError(true)
                setErrorMessage('Some fields are Empty!')
                return
              }
                uploadPostWithText()
                setError(false)
                setErrorMessage('Some fields are Empty!')
                return
          }
    
          if(postType === 'image'){
            if(title === '' || description === '' || urls.length === 0){
              setError(true)
              setErrorMessage('Some fields are Empty!')
              return
            }
            uploadPostWithImage()
            setError(false)
          return
          }
    
          if(postType === 'video'){
            if(title === '' || description === '' || video === ''){
              setError(true)
              setErrorMessage('Some fields are Empty!')
              return
            }
            uploadPostWithVideo()
            setError(false)
          return
          }

      } 

      const uploadPostWithText = async  () => {

        const newLinks = links.split(' ')

        const docRef = doc(collection(getFirestore(), "announcements"))
        const payload = {
          docId: docRef.id,
          userHandle: uid,
          title: title,
          description: description,
          links: newLinks,
          createdAt: serverTimestamp(),
          ticks: 0,
          loves: [],
          comments: [],
          category: announcementTypeRef.current.value
        }
        await setDoc(docRef, payload).then(
        )
        setModalIsOpen(true)
        addNotification(docRef.id)
      }

      const uploadPostWithVideo = async () => {

        const newLinks = links.split(' ')

        const docRef = doc(collection(getFirestore(), "announcements"))
        const payload = {
          docId: docRef.id,
          userHandle: uid,
          title: title,
          description: description,
          links: newLinks,
          video: video,
          createdAt: serverTimestamp(),
          ticks: 0,
          loves: [],
          comments: [],
          category: announcementTypeRef.current.value
        }
        await setDoc(docRef, payload).then(
          //console.log(docRef.id)
        )
        setModalIsOpen(true)
        addNotification(docRef.id)
      }

      const uploadPostWithImage = async () => {
        {

          const newLinks = links.split(' ')
      
          const docRef = doc(collection(getFirestore(), "announcements"))
          const payload = {
            docId: docRef.id,
            userHandle: uid,
            title: title,
            description: description,
            links: newLinks,
            images: urls,
            createdAt: serverTimestamp(),
            ticks: 0,
            loves: [],
            comments: [],
            category: announcementTypeRef.current.value
          }
          await setDoc(docRef, payload).then(
          )
          setModalIsOpen(true)
          addNotification(docRef.id)
        }
      }

      const addNotification = async (postId) => {

        allUsersUid.map(async(user) => {
       
            const docRef = doc(collection(getFirestore(), "notifications"))
            const payload = {
              notificationId: docRef.id,
              notificationFor: announcementTypeRef.current.value,
              postId: postId,
              trigerredByName: localStorage.getItem('name'),
              trigerredByUid: localStorage.getItem('uid'),
              trigerredByUserProfile: localStorage.getItem('photoURL'),
              notificationAbout: ' Added a new '+ announcementTypeRef.current.value,
              createdAt: serverTimestamp(),
              userHandle: user.docId,
              viewed: false
            }
            await setDoc(docRef, payload).then(
              
            )
      
        })
        
       
    
      }


      return (
      <div className='w-full h-auto'> 
        <div className='w-full bg-white shadow rounded border h-auto'>
          <h1 className='text-md text-slate-500 font-bold pl-2 pt-2 pb-2'>
            Post an announcement - 
          </h1>
            <div className='text-slate-400 w-full grid grid-cols-3 items-center justify-center gap-1 px-1 pb-1'>
            {
              postType === 'post'?
              <div id='post__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow' onClick={()=>setPostType("post")}>
              <BsFileEarmarkPost/> Post
              </div> 
              :
              <div id='post__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow' onClick={()=>setPostType("post")}>
              <BsFileEarmarkPost/> Post
              </div> 
            }

            {
              postType === 'image'?
              <div id='image__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow'  onClick={()=>setPostType("image")}>
              <BsCardImage/> Image
              </div>:
              <div id='image__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow'  onClick={()=>setPostType("image")}>
              <BsCardImage/> Image
              </div>
            }
              {
              postType === 'video'? 
              <div id='video__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 bg-fuchsia-700 text-white rounded shadow'  onClick={()=>setPostType("video")}>
              <BsCameraVideo/> Video
              </div>
              :
              <div id='video__post' className='flex items-center justify-center p-3 cursor-pointer gap-x-2 hover:bg-fuchsia-700 hover:text-white rounded shadow'  onClick={()=>setPostType("video")}>
              <BsCameraVideo/> Video
              </div>
              }
            </div>
          </div>

          <div className='bg-white w-full p-4'>
              <div className='w-full font-semibold'>
              <p className='text-slate-500 p-2'>Title</p>
              <input type="text" placeholder='Title' className='w-full outline-none text-slate-400 border p-2 rounded' onChange={handleSetTitle}/>
              </div>
              <div className='w-full font-semibold'>
              <p className='text-slate-500 p-2'>Content</p>
              <input type="text" placeholder='Post caption' className='w-full outline-none text-slate-400 border p-2 rounded'  onChange={handleSetDescription}/>
              </div>

              <div className='w-full font-semibold'>
              <p className='text-slate-500 p-2'>Links (optional)</p>
              <input type="text" placeholder='Links' className='w-full outline-none text-slate-400 border p-2 rounded'  onChange={handleSetLinks}/>
              </div>

              {
                postType === 'post'? null:null
              }

              {
                postType === 'image'? 
                <div className='w-full font-semibold'>
                
                <p className='text-slate-500 p-2'>Upload Image:</p>

                <div className='w-full '>
                                  
                    <div className='w-full h-auto grid grid-cols-4 gap-y-1 md:grid-cols-7 md:gap-y-2 justify-center items-center'>

                    {
                      urls.length !== 0?
                      urls.map((url) =>{
                        return <img src={url} key={url} alt="url"className="h-16 w-16 border-2 border-rose-400 rounded" onClick={removeImage}/>
                      })
                      :
                      null
                    }
            
                    <label htmlFor="file"><BiImageAdd className='h-20 w-20 text-fuchsia-700'/></label>
                    <input type="file" id='file' className='hidden'  onChange={onImageChange} multiple="multiple" accept='image/png, image/jpeg, image/jpg, image/gif'/>
                    </div>
                    {
                      <p className='text-xs text-slate-500'>Upload: {progress} %</p>
                    }
            
                </div>
                </div>  
                :null
              }

              {
                postType === 'video'? 
                <div className='w-full font-semibold'>
                <p className='text-slate-500 p-2'>Add Video:</p>
                <input type='text' placeholder='Add Link' className='w-full outline-none text-slate-400 border p-2 rounded' onChange={handleSetVideo}/>
                </div>
                :null
              }

              <div className='w-full font-semibold'>
              <p className='text-slate-500 p-2'>Type:</p>
              <select name='course' ref={announcementTypeRef} defaultValue={'Announcements'} className="outline-none  border p-2 rounded-md  cursor-pointer text-slate-500">
                       <option value="Announcements">Announcements</option>
                       <option value="Events">Events</option>   
                       <option value="Webinars">Webinars</option>                        
                       <option value="Ojts-&-Hirings">Ojts & Hirings</option>   
                     </select>
              </div>
              {
                error?<p className='text-rose-500 w-full text-center py-2'>{errorMessage}</p>:null
              }
              <div className='flex w-full justify-center mt-2'>
                  <button className='border bg-fuchsia-700 text-slate-200 text-lg font-bold w-80 py-2 shadow rounded hover:bg-fuchsia-500 hover:text-white' onClick={handleSubmit}>Post</button>
              </div>
          </div>
              
          <Modal
            isOpen={modalIsOpen}
            style={customStyles}
          >
            <div className='flex flex-col items-center'>
              <div  className='flex items-center justify-center py-5'><h1 className='font-bold'>Announcement added successfully!</h1></div>
              <button className='flex items-center justify-center px-10 py-2 rounded bg-fuchsia-700 hover:bg-fuchsia-600 hover:text-white text-white' onClick={closeModal}>Ok</button>
            </div>
            
          </Modal>
      


      </div>
      ) 
}

export default Announcements