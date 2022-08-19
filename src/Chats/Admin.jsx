import React, {useEffect, useState, useRef} from 'react'
import {doc, serverTimestamp, setDoc, getFirestore, collection, getDocs, orderBy, query,getDoc, where, updateDoc, limit} from "firebase/firestore"
import Modal from 'react-modal/lib/components/Modal'
import moment from 'moment'
import {AiOutlineArrowLeft} from 'react-icons/ai'
import ScrollToBottom from 'react-scroll-to-bottom'

const Admin = () => {

  const [totalMessages, setTotalMessages] = useState(0)
  const adminUid = localStorage.getItem('uid')
  const [adminWithChannels, setAdminWithChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('')
  const [messagesWithCurrentChannel, setMessagesWithCurrentChannel] = useState([])
  const [messageUserHandle, setMessageUserHandle] = useState('')

  const messageBoxTextRef = useRef()

  const [showMessageBox, setShowMessageBox] = useState(false)
  
  useEffect(() => {
    
    getAdminChannels()

  }, [])

  const getAdminChannels = async  () =>{

    const queryToOrder = query(collection(getFirestore(), "adminchannelmessages"), where("adminId", "==", `${adminUid}`), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchannelmessages"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })

    setAdminWithChannels(returnArr);
    setTotalMessages(returnArr.length)
  }

  const openMessageBox = async (msgChannel) => {
    
    setSelectedChannel(msgChannel)
    getMessagesWithChannel(msgChannel)
    setShowMessageBox(true)

  }

  const getMessagesWithChannel = async (msgChannel) => {

    const queryToOrder = query(collection(getFirestore(), "adminchatmessages"), where("messageChannel", "==", `${msgChannel}`), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchatmessages"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    setMessagesWithCurrentChannel(returnArr)
    

  }

  const updateChannelCreateAt = async (msgChannel) => {
    const channelRef = doc(getFirestore(), "adminchannelmessages", `${msgChannel}`);
    const docSnap = await getDoc(channelRef);

    if(docSnap.exists()){  
      await updateDoc(channelRef, {
        createdAt: serverTimestamp()
      });
    } else {
      console.log('Docs does not exists')
    }

    getMessagesWithChannel(msgChannel)
}



  const closeMessageBox = () => {
    setSelectedChannel('')
    setShowMessageBox(false)
  }

  const sendMessageWithChannel = async (msgChannel) => {

    const textmessage  = messageBoxTextRef.current.value

      const docRef = doc(collection(getFirestore(), "adminchatmessages"))
      const payload = {
        docId: docRef.id,
        createdAt: serverTimestamp(),
        message: textmessage,
        messageChannel: msgChannel,
        name: localStorage.getItem('name'),
        profileImage: localStorage.getItem('photoURL'),
        sentBy: localStorage.getItem('uid')
      }
      await setDoc(docRef, payload).then(
      )

      getMessagesWithChannel(msgChannel)
      updateChannelCreateAt(msgChannel)
      messageBoxTextRef.current.value = ''
      getUserHandle(selectedChannel)
  }

  const getUserHandle = async (channel) => {
      
    const queryToOrder = query(collection(getFirestore(), "adminchannelmessages"), where("messageChannel", "==", `${channel}`), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "adminchannelmessages"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item);
    })
    
    setMessageUserHandle(returnArr[0].userId)
    addNotification(returnArr[0].userId)

  }



  const addNotification = async (userHandle) => {

    const docRef = doc(collection(getFirestore(), "notifications"))
    const payload = {
      notificationId: docRef.id,
      notificationFor: 'message',
      postId: null,
      trigerredByName: localStorage.getItem('name'),
      trigerredByUid: localStorage.getItem('uid'),
      trigerredByUserProfile: localStorage.getItem('photoURL'),
      notificationAbout: ' Sent you a Message',
      userHandle: userHandle,
      createdAt: serverTimestamp(),
      viewed: false
    }
    await setDoc(docRef, payload).then(
      
    )

  }


  return (
    <div className='w-full bg-white'>

        {
          showMessageBox?
          <div className='w-full p-2 h-screen'> 
            <div className="cursor-pointer flex items-center text-slate-500 font-normal gap-1 p-2 hover:text-rose-500" onClick={()=> {closeMessageBox()}}><AiOutlineArrowLeft className='font-bold'/> Go Back</div>
            
            <ScrollToBottom className='h-4/6 bg-slate-200 shadow rounded-md w-full p-2 space-y-2 overflow-hidden'>
                    {
                      messagesWithCurrentChannel.map( (message) => {
                         return <div className=' flex w-full pt-1' key={message.docId}>
                                                      {
                                                          message.sentBy === adminUid?
                                                          <div className='ml-auto mr-0 flex items-center w-auto bg-transparent gap-x-2'>
                                                              <div className='rounded-md w-auto bg-white px-2 text-right'>
                                                                  <p>{message.message}</p>
                                                                  {
                                                                      message.createdAt === null? 
                                                                      <i className='text-xs'>just now ...</i>
                                                                      :
                                                                      <i className='text-xs'>{moment(message.createdAt.toDate()).fromNow()}</i>
                                                                  }
                                                              </div>
                                                              <img src={message.profileImage} width={50} alt="" className='rounded-full'/>
                                                          </div>
                                                          : 
                                                          <div>
                                                              <p className='text-xs ml-14 pl-1'>{message.name}</p>
                                                              <div className='flex items-center w-auto bg-transparent gap-x-2'>
                                                                  <img src={message.profileImage} width={50} alt="" className='rounded-full'/>
                                                                  <div className='rounded-md w-auto bg-slate-100 px-2'>
                                                                      <p>{message.message}</p>
                                                                      {
                                                                          message.createdAt === null? 
                                                                          <i className='text-xs'>just now ...</i>
                                                                          :
                                                                          <i className='text-xs'>{moment(message.createdAt.toDate()).fromNow()}</i>
                                                                      }
                                                                  </div>
                                                              </div>
                                                          </div>
                                                         
                                                      }
                                                  </div>
                      })
                    }
            </ScrollToBottom>

            <div className='flex mt-1 gap-1'>
              <textarea name="" id="" className='w-full outline-none border rounded p-1 text-slate-500' rows="2" ref={messageBoxTextRef}></textarea>
              <button className='px-5 bg-rose-500 rounded text-white' onClick={()=>{sendMessageWithChannel(selectedChannel)}}>Send</button>
            </div>
          </div>
          :
          <div className='w-full p-2'>
              
          <p className='text-slate-500 p-2'>Messages ({totalMessages})</p>

            {
              adminWithChannels.map((channel) => {
                return <div key={channel.messageChannel} className='w-full flex shadow p-2 rounded-md cursor-pointer hover:bg-slate-100' onClick={() => {openMessageBox(channel.messageChannel)}}>
                            <div>
                              <p className='text-slate-500 font-bold'>{channel.userName}</p>
                              <i className='text-slate-500 text-xs'>Message sent <p className='font-bold'>{moment(channel.createdAt.toDate()).fromNow()}</p></i>
                            </div>
                        </div>
              })
            }


          </div>
        }
          
       
      
    </div>
  )

}

export default Admin
