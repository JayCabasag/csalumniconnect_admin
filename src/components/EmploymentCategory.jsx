import React, {useEffect, useState} from 'react'
import { RiDeleteBack2Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { setDoc, doc, getFirestore, collection, query, where, orderBy, getDocs, getDoc, addDoc, deleteDoc} from "firebase/firestore"

const EmploymentCategory = () => {

  const [allEmploymentCategories, setAllEmploymentCategories] = useState([])
  const [categoryToAdd, setCategoryToAdd] = useState('')
  const [categoryColor, setCategoryColor] = useState('#FCFCFC')

  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getAllEmploymentCategories();
  }, [])
  
  const getAllEmploymentCategories = async () => {

    setAllEmploymentCategories([])

    const querySnapshot = await getDocs(collection(getFirestore(), "employmentcategories")); 
    var returnArr = [];

    querySnapshot.forEach((doc) => {
      returnArr.push(doc.data());
    })

    setAllEmploymentCategories(returnArr)
    console.log(returnArr)
  }

  const addCategory = async () => {

      if(categoryToAdd === ''){
        setError(true)
        setErrorMessage('Make sure that category field is not empty')
        setSuccess(false)
        return
      }

      if(categoryColor === '#FCFCFC'){
        setError(true)
        setErrorMessage('Please select a color')
        setSuccess(false)
        return
      }

      const docRef = doc(collection(getFirestore(), "employmentcategories"))
      const payload = {
        docId: docRef.id,
        category: categoryToAdd,
        color: categoryColor
      }
        await setDoc(docRef, payload).then(
            //console.log(docRef.id)
        )
        setError(false)
        setSuccess(true)
        setErrorMessage('Employment category  added successfully')
        setCategoryColor('#FCFCFC')
        setCategoryToAdd('')
        getAllEmploymentCategories()
  }

  const deleteCategory = async (value) => {
    await deleteDoc(doc(getFirestore(), "employmentcategories", `${value}`));
    getAllEmploymentCategories()
  }

  


  return (
    <div className='flex w-full flex-col bg-white rounded-md shadow'>
            <p className='p-2 text-slate-500'>Employment Categories</p>

           <div className='w-full'>
               <ul className='px-2 flex w-full flex-wrap h-auto gap-2 items-center justify-center'>

                        {
                           allEmploymentCategories.length === 0?
                            <p className='text-slate-500'>No employment categories added.</p>
                            :
                            null
                        }
                        {
                             allEmploymentCategories.map((category) => {
                                return <li className='p-2 border rounded-md w-max flex justify-center items-center gap-x-2 text-white' style={{background: category.color}} key={category.docId}><span >{category.category}</span> <RiDeleteBack2Line className='hover:text-rose-500 cursor-pointer' onClick={() => {deleteCategory(category.docId)}} /></li>
                            })
                        }
                    </ul>  
            </div>
            
            <div className='flex flex-col justify-center items-center py-5 gap-x-2'>
                <div className='flex w-full justify-center items-center'>  
                   <input className='text-slate-500 border rounded-sm px-2 py-2 outline-none' type="text" placeholder='Category' value={categoryToAdd} onChange={(e) => {setCategoryToAdd(e.target.value)}}/>
                   <input type="color" className='h-12 outline-none rounded-md' id="head" name="head" value={categoryColor} onChange={(e) => {setCategoryColor(e.target.value)}}/>

                  <button className='border rounded-md px-5 py-2 text-fuchsia-700 hover:bg-fuchsia-700 hover:text-white' onClick={() => {addCategory()}}>Add</button>
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
  )
}

export default EmploymentCategory