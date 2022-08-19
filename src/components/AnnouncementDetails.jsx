import React, { useEffect,  useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import {doc, getFirestore, deleteDoc, where, collection, getDocs, getDoc, orderBy, query, limit, documentId, exists, updateDoc, Timestamp, setDoc, addDoc, serverTimestamp, increment} from "firebase/firestore"
import moment from 'moment';
import ReactPlayer from 'react-player';
import { FiDelete } from 'react-icons/fi'
import Modal from 'react-modal/lib/components/Modal';
import {AiOutlineDelete} from 'react-icons/ai';
import Spinner from './Spinner';

const AnnouncementDetails = () => {

  const navigate = useNavigate();
  const { postId } = useParams();
  const [posts, setPosts] = useState({})
  const [displayName, setDisplayName] = useState('')
  const [userHandle, setUserHandle] = useState('')
  const [postedByProfile, setPostedByProfile] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [timePassed, setTimePassed] = useState('')
  const [postDescription, setPostDescription] = useState('')
  const [postLinks, setPostLinks] = useState([])
  const [tags, setTags] = useState([])
  const [images, setImages] = useState([])
  const [video, setVideo] = useState('')
  const textCommentRef = useRef()
  const [showDeleteButton, setShowDeleteButton] = useState(false)
  const [loading, setLoading] = useState(false)

  const [commentDefaultValue, setCommentDefaultValue] = useState('')

  //Modal
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

  const [commentToBeDeleted, setCommentToBeDeleted] = useState('')

  const deleteComment = (idOfComment) => {
    setModalIsOpen(true)
    setCommentToBeDeleted(idOfComment)
  }

  const cancelDeletion = () => {
    setModalIsOpen(false)
    setCommentToBeDeleted('')
  }
  const confirmDeletion = async () => {
    await deleteDoc(doc(getFirestore(), "comments", `${commentToBeDeleted}`));
    setModalIsOpen(false)
    refreshComments()
  }



  const uid = localStorage.getItem('uid')
  const currentUserImageProfile = localStorage.getItem('photoURL')
  const commentorName = localStorage.getItem('name')

  const [comments, setComments] = useState([])

  const [totalComments, setTotalComments] = useState(0)

  useEffect( async () => {
    setLoading(true)
    const userRef = doc(getFirestore(), "announcements", `${postId}`);
    const docSnap = await getDoc(userRef);
    

    if (docSnap.exists()) {
      setPosts(docSnap.data())
      setUserHandle(docSnap.data().userHandle)
      setTimePassed(moment(docSnap.data().createdAt.toDate()).fromNow())
      setPostDescription(docSnap.data().description)
      setPostLinks(docSnap.data().links)
      setTags(docSnap.data().tags)
      setImages(docSnap.data().images)
      setVideo(docSnap.data().video)
        
      const users = doc(getFirestore(), 'admins', `${docSnap.data().userHandle}` );
      const docSnapShot = await getDoc(users);
        setPostedByProfile(docSnapShot.data().profileURL)
        setDisplayName(docSnapShot.data().name)
        setCourse('Administrator')
        setLoading(false)
    } else {
      console.log("No such document!");
    }

    refreshComments();

  }, [])  

  const refreshComments = async () => 
  {
    const commentsRef = collection(getFirestore(), 'comments');
    const q = query(commentsRef, where("commentFor", "==", `${postId}`));
    const querySnapshot = await getDocs(q);

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setComments(returnArr);
    setTotalComments(returnArr.length)
  }
  
  const goBack = () => {
    navigate('/')
  }

  const copyExternalLink = (currentLink) =>{
    navigator.clipboard.writeText(currentLink)
    alert('link copied')
  }

  const addComment = async () => {

    const commentData = textCommentRef.current.value;

    if(commentData === '' || commentData === undefined){
      alert('Make sure to input a text on comment field')
    } else {
    
      const docRef = doc(collection(getFirestore(), "comments"))
      const payload = {
        docId: docRef.id,
        commentBy: uid,
        commentFor: postId,
        commentMessage: commentData,
        commentorImageProfile: currentUserImageProfile,
        commentorName: commentorName,
        createdAt: serverTimestamp()
      }
      await setDoc(docRef, payload).then(
        refreshComments()
      )
      
    
      addTicks()
      textCommentRef.current.value = ''
    }

  }

  const addTicks = async () => {
    const ticksRef = doc(getFirestore(), "announcements", `${postId}`);
    const docSnap = await getDoc(ticksRef);

    if(docSnap.exists()){  
      await updateDoc(ticksRef, {
        ticks: increment(1)
      });
    } else {
      console.log('Docs does not exists')
    }
  }



  const [modalForPostDeletion, setModalForPostDeletion] = useState(false)
  const [postToDelete, setPostToDelete] = useState('')

  const deletePost = () => {
    setPostToDelete(postId)
    setModalForPostDeletion(true)
  }

  const confirmDeletePost = async () =>{
    await deleteDoc(doc(getFirestore(), "announcements", `${postToDelete}`));
    setModalIsOpen(false)
    navigate('/')
  }

  const cancelPostDeletion = () => {
    setPostToDelete('')
    setModalForPostDeletion(false)
  }


  const [modalForReportPost, setModalForReportPost] = useState(false)
  const [postToReport, setPostToReport] = useState('')
  const [reasonForReporting, setreasonForReporting] = useState('')
  const  reportResonRef = useRef()
  const [errorReporting, setErrorReporting] = useState(false)
  const [errorReportingMessage, setErrorReportingMessage] = useState('')

  const reportPost = () => {
   setPostToReport(postId)
   setModalForReportPost(true)
  }
  const confirmReportPost = async () => {
    if(reportResonRef.current.value === ''){
      setErrorReporting(true)
      setErrorReportingMessage('Please add a reason for reporting')

    } else {
      
      // Adding data to database starts here baby...

      const docRef = doc(collection(getFirestore(), "reports"))
      const payload = {
        reportId: docRef.id,
        reportForPost: postId,
        reportReason: reportResonRef.current.value,
        reportedAt: serverTimestamp(),
        reportedBy: uid,
        reviewStatus: 'pending'
      }
      await setDoc(docRef, payload).then(
        
      )
      
      setErrorReporting(false)
      setErrorReportingMessage('')
      setModalForReportPost(false)
    }
  }

  const cancelPostReport = () => {
   setPostToReport('')
   setModalForReportPost(false)
   setErrorReporting(false)
   setErrorReportingMessage('')
  }

  
  return (
    <div>
      <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
        <span>
          <FaArrowLeft className='text-slate-500 cursor-pointer' onClick={()=>goBack()}/>
        </span>
        <p className='font-bold text-slate-500'>
          Announcement details
        </p>
        </div>

      {/*Post data starts Here*/}

      {
          loading?
          <Spinner />
          :
          <div className='pb-5 bg-white rounded shadow mt-1 items-center justify-center px-4 md:px-8 overflow-y-hidden'>
            <div className='flex h-auto w-auto pt-3 place-content-end px-2'>
                        <div className='cursor-pointer w-auto flex gap-1'>
                            <AiOutlineDelete className='text-slate-500 text-lg md:text-xl hover:text-fuchsia-700' onClick={() => {deletePost()}}/>      
                        </div>
            </div>

                <div className='flex flex-cols-3 pt-3 pl-0 w-auto'>
                    <img src={postedByProfile} width={55} height={55} className='rounded-full'/>
                    <div className='flex flex-col pl-2 w-4/5'>
                        <p className='font-semibold'>{displayName}</p>
                        <p className='font-thin text-sm'>{timePassed} - {course}</p>
                    </div>
                </div>
          
          
            
            <div className='py-2' >
                    {
                        <p>{postDescription}</p>
                    }
            </div>
            <div className='py-1 w-auto'>
                <p>Links:</p>
              <ul className='flex space-x-2 text-blue-500 overflow-hidden hover:overflow-auto'>
                    { 
                        postLinks.map((link)=>{
                            return <li key={link}><a onClick={() => copyExternalLink(link)}>{link}</a></li> 
                        })
                    }
              </ul>
            </div>
            
            <div className='w-full h-auto flex flex-col gap-y-2'>
              
                {
                    images === undefined? null :  images.map((img)=>{

                      return <img className='rounded w-full' alt='user-post' src={img}/>

                    })

                }

                {
                    video === undefined? null :  <ReactPlayer
                    url={video}
                    controls
                    width='100%'
                    height={420}
                  />
            
                }


            </div>
            <div className='pt-2 grid grid-cols-3 items-center justify-center'>
      
            </div>


            <div className='flex gap-1'>
              <textarea name="" id="" rows="1" placeholder='Add comment here ...' className='p-2 w-full outline-none border text-slate-500 shadow rounded' ref={textCommentRef}>
              </textarea> 
              <div className='bg-fuchsia-700 text-white p-2 shadow rounded hover:bg-fuchsia-600'>
                <button onClick={() => addComment()} className="text-center justify-center items-center">Add Comment</button>
              </div>
            </div>


            <div>
              <p className='p-2 text-slate-600'>All Comments ({totalComments})</p>


              <div className='flex flex-col gap-y-1'>

                {
                  comments.length === 0? <p className='w-full text-center text-slate-500 text-sm '>No comments to show... Be the first one!</p> : 
                  comments.map(comment => {

                    return <div className='w-auto bg-slate-100 rounded-md'>
                                  <div className='flex w-auto p-1 '>
                                  <img src={comment.commentorImageProfile} alt="user" width={50} className="rounded-full p-1"/>
                                    <div>
                                        <p>{comment.commentorName}</p>

                                        {
                                          comment.createdAt === null? 
                                          <p className='italic text-xs'>Added just now ...</p>
                                          :
                                          <p className='italic text-xs'>{moment(comment.createdAt.toDate()).format('LLL')}</p>
                                        }
                                        
                                    </div>
                                   
                                      <button className='italic text-md text-fuchsia-700 ml-auto mr-0 pr-2' onClick={() => {deleteComment(comment.docId)}}>
                                          <FiDelete />
                                      </button>
                                   
                                  </div>
                                  <div>
                                      <p className='text-sm pb-2 pl-5 text-slate-600'>{comment.commentMessage}</p>
                                  </div>         
                      </div> ;
                   })                 
                }

              </div>
            </div>
        </div>
      }

          
        {/*Modal for Comment*/}
      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
      >
        <div className='flex flex-col items-center'>
          <div  className='flex items-center justify-center py-5'><h1 className='font-bold'>Continue deleting this comment?</h1></div>
          <div className='flex w-full items-center justify-center gap-1'>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{confirmDeletion()}}>Ok</button>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{cancelDeletion()}}>Cancel</button>
          </div>
        </div>
        
      </Modal>



      {/* Modal for Delete Post */}

      <Modal
        isOpen={modalForPostDeletion}
        style={customStyles}
      >
        <div className='flex flex-col items-center'>
          <div  className='flex items-center justify-center py-5'><h1 className='font-bold'>This action cannot be undone. Continue deleting this Post? </h1></div>
          <div className='flex w-full items-center justify-center gap-1'>
          <button className='flex items-center justify-center px-10 py-2 rounded  bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{confirmDeletePost()}}>Confirm</button>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{cancelPostDeletion()}}>Cancel</button>
          </div>
        </div>
        
      </Modal>

      {/* Modal for Reporting POst */}


      <Modal
        isOpen={modalForReportPost}
        style={customStyles}
      >
        <div className='flex flex-col items-center'>
          <div  className='flex items-center justify-center py-5 flex-col gap-y-1'>
            <h1 className='font-bold'>Reason for Reporting this Post: </h1>
            {
              errorReporting?
              <p className='text-rose-600 text-center text-sm'>{errorReportingMessage}</p>:
              null
            }
            <textarea name="" id="" cols="30" rows="2" className='outline-none border rounded p-1' ref={reportResonRef}></textarea>
          </div>
          <div className='flex w-full items-center justify-center gap-1'>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{confirmReportPost()}}>Report</button>
          <button className='flex items-center justify-center px-10 py-2 rounded bg-rose-600 hover:bg-rose-500 hover:text-white text-white' onClick={()=>{cancelPostReport()}}>Cancel</button>
          </div>
        </div>
        
      </Modal>

    </div>
  )
}

export default AnnouncementDetails