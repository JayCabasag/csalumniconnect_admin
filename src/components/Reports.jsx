import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {FaArrowLeft} from 'react-icons/fa'
import {doc, getFirestore, collection, getDocs, getDoc, orderBy, query, limit, updateDoc, where} from "firebase/firestore"
import moment from 'moment'
import TextTruncate from 'react-text-truncate';


const Reports = () => {

  const navigate = useNavigate()
  const [allReports, setAllReports] = useState([])
  const [totalReports, setTotalReports] = useState(0)


  const [allCompletedReports, setAllCompletedReports] = useState([])
  const [totalCompletedReports, setTotalCompletedReports] = useState(0)

  useEffect(() => {
    getAllReports()
    getAllCompletedReports()
  }, [])

  const getAllReports = async () => {

    const queryToOrder = query(collection(getFirestore(), "reports"), orderBy('reportedAt', 'desc'), where('reviewStatus', '==', 'pending'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "reports"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var docId = doc.id
      var item = doc.data();
      item['docId'] = docId;
      returnArr.push(item);
    })

    setAllReports(returnArr);
    setTotalReports(returnArr.length)
  }


  const getAllCompletedReports = async () => {

    const queryToOrder = query(collection(getFirestore(), "reports"), orderBy('reportedAt', 'desc'), where('reviewStatus', '==', 'Completed'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "reports"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var docId = doc.id
      var item = doc.data();
      item['docId'] = docId;
      returnArr.push(item);
    })

    setAllCompletedReports(returnArr);
    setTotalCompletedReports(returnArr.length)
  }
  
  
  const reviewDone = async (reportId) => {

      
    const docsRef = doc(getFirestore(), "reports", `${reportId}`);
    const docSnap = await getDoc(docsRef);

    if(docSnap.exists()){  
      await updateDoc(docsRef, {
        reviewStatus: 'Completed'
      }); } 
    else {
        alert('User does not exist')
    }

    getAllReports()
    getAllCompletedReports()
  }
  
  return (
    <div className='w-full flex flex-col gap-y-1'>
    <div className='w-full flex text-slate-500 items-center bg-white p-2 rounded-md cursor-pointer' onClick={()=>{navigate('/')}} ><FaArrowLeft className='m-1'/> <p className='p-1 font-bold'>Reports</p></div>

    <p className='text-slate-500 p-1'>Total Reports ({totalReports})</p>
    {
      allReports.map( (report) => {
        return   <div key={report.reportId} className='flex w-full bg-white p-2 rounded-md text-slate-500 items-center'>
                    <div className='flex flex-col'>
                        <div className='flex'>
                          <p className='font-bold text-sm'>Reported Reason : <span className='text-sm font-normal'> {report.reportReason} </span></p>
                          
                        </div>
                        <p className='italic text-xs'>Post Id: {report.reportForPost}</p>
                        <p className='text-xs font-mono'>Date Reported: {moment(report.reportedAt.toDate()).fromNow()}</p>
                    </div>
                   
                   <div className='ml-auto mr-2 flex gap-x-1 h-auto'>
                    <button className='bg-rose-500 hover:bg-red-400  text-white px-3 py-2 rounded-md' onClick={()=>{navigate(`/post-detail/${report.reportForPost}`)}}>Review Post</button>
                    <button className='bg-rose-500 hover:bg-red-400  text-white px-3 py-2 rounded-md' onClick={()=>{reviewDone(report.reportId)}}>Done</button>
                   </div>
                  </div>
                  })
    }

    <p className='text-slate-500 p-1'>Total Completed Reports ({totalCompletedReports})</p>


    {
      allCompletedReports.map((report) => {
        return   <div key={report.reportId} className='flex w-full bg-white p-2 rounded-md text-slate-500 items-center'>
                        <div className='flex flex-col'>
                            <div className='flex'>
                              <p className='font-bold text-sm'>Reported Reason : <span className='text-sm font-normal'> {report.reportReason} </span></p>
                              
                            </div>
                            <p className='italic text-xs'>Post Id: {report.reportForPost}</p>
                            <p className='text-xs font-mono'>Date Reported: {moment(report.reportedAt.toDate()).fromNow()}</p>
                        </div>
                      
                      <div className='ml-auto mr-2 flex gap-x-1 h-auto'>
                        <button className='bg-rose-500 hover:bg-red-400  text-white px-3 py-2 rounded-md' onClick={()=>{navigate(`/post-detail/${report.reportForPost}`)}}>Review Again</button>
                      </div>
                      </div>
                      })
    }
    </div>
  )
}

export default Reports