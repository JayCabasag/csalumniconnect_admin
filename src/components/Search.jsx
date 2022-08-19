import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {IoMdSearch} from 'react-icons/io'
import {doc, getFirestore, deleteDoc, where, collection, getDocs, getDoc, orderBy, query, limit, documentId, exists, updateDoc, Timestamp, setDoc, addDoc, serverTimestamp, increment} from "firebase/firestore"
import Masonry from 'react-masonry-css';
import Post from './Post';

const Search = () => {

  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [totalResultsForUser, setTotalResultsForUser] = useState(0)
  const [totalResultsForPost, setTotalResultsForPost] = useState(0)
  const [userSearchResults, setUserSearchResults] = useState([])
  const [postResults, setPostResults] = useState([])
  const [typeToSearch, setTypeToSearch] = useState('user')

  const breakpointColumnsObj = {
    default: 1,
  };

  useEffect(() => {
      SearchUserByFullname()
      SearchPostById()
  }, [searchTerm])
  
  const SearchUserByFullname = async () => {

    setUserSearchResults([])
    setTypeToSearch('user')

    const queryToOrder = query(collection(getFirestore(), "users"), where("displayName", "==", `${searchTerm}`));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var docId = doc.id
      var item = doc.data();
      item['docId'] = docId;
      returnArr.push(item);
    })

    setUserSearchResults(returnArr);
    setTotalResultsForUser(userSearchResults.length)
  }

  const SearchPostById = async () => {
    
    setUserSearchResults([])
    setTypeToSearch('post')

    const docRef = doc(getFirestore(), "posts", `${searchTerm}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      var returnArr = [];
      var docId = docSnap.id
      var item = docSnap.data();
      item['docId'] = docId;
      returnArr.push(item);

      setPostResults(returnArr)
      setTotalResultsForPost(returnArr.length)
      console.log(returnArr)
      
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    
  }

  return (
    <div className='w-full pt-5 px-5 text-slate-500 flex flex-col'>
      <div className='w-full flex items-center'>
      <div className='flex justify-start items-center w-1/2 px-2 rounded-l-md bg-white border border-fuchsia-300 outline-none focus-within:shadow-small py-0.5'>
        <IoMdSearch fontSize={21} className="text-black ml-1"/>
          <input 
          type="text" 
          autoFocus={true}
          placeholder="Search post via id or user via fullname"
          defaultValue={searchTerm}
          onChange={(e)=>{setSearchTerm(e.target.value)}}
          className='p-2 w-full bg-white outline-none'
          />
      </div>
     <div className='flex'>
     <button className='bg-fuchsia-500 text-white py-2.5 px-5 border w-auto' onClick={() => SearchUserByFullname()}>Search username</button>
      <button className='bg-fuchsia-500 text-white py-2.5 px-5 border w-auto' onClick={() => SearchPostById()}>Search post</button>
     </div>
      </div>

            <div>
              {
                totalResultsForUser === 0?
                null
                :
                 <p className='p-2 text-slate-500 my-2'>
                  Results user for "{searchTerm}"

                  {
                    userSearchResults.map((user)=>{
                      return <div key={user.docId} className='w-full flex bg-white p-1 rounded items-center border px-3'>
                              <img src={user.image} alt="" width={50} className="border rounded-full "/>
                              <div>
                              <p className='font-bold px-1 text-slate-500 '>{user.displayName}</p>
                              <p className='italic text-slate-500 text-xs'>ID : {user.docId}</p>
                              </div>
                              
                              <button className='border py-2 bg-fuchsia-700 text-white rounded-md ml-auto px-3' onClick={() => {navigate(`../user-profile/${user.docId}`)}}>Check</button>
                      
                            </div>
                    })
                  }
                 </p>
              }

              

              {
                totalResultsForPost === 0?
                  null
                :
                 <p className='p-2 text-slate-500 my-2'>
                  Results post for "{searchTerm}"
                  {
                      postResults.map((post)=>{
                      return <div key={post.docId} className='w-full flex bg-white p-1 rounded items-center border px-3'>
                              <div>
                              <p className='font-bold px-1 text-slate-500 '>{post.title}</p>
                              <p className='italic text-slate-500 text-xs'>ID : {post.docId}</p>
                              </div>
                              
                              <button className='border py-2 bg-fuchsia-700 text-white rounded-md ml-auto px-3' onClick={() => {navigate(`../post-detail/${post.docId}`)}}>Check</button>
                      
                            </div>
                    })
                  }

                 </p>
              }

              
            </div>


        </div>
  )
}
export default Search