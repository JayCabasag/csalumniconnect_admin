import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getFirestore, where, collection, getDocs, query} from "firebase/firestore"
import AlumniOverview from './AlumniOverview';
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend);

const AlumniTracker = () => {

  const [allJobs, setAllJobs] = useState([])
  const [jobColors, setJobColors] = useState([])
  const [numberOfAlumniWithThisProfession, setNumberOfAlumniWithThisProfession] = useState([])
  const [allBatch, setAllBatch] = useState([])
  const [searchBatch, setSearchBatch] = useState('2006-Present')

  useEffect(() => {
    getAllJobs();
    getAllBatch();
  }, [])

  const getAllBatch =async () => {

    setAllBatch([])

    const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"),  where("verified", "==",true), where("employmentStatus", '==', 'Employed'));
    const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));

    var returnArr = [];
    querySnapshot.forEach((doc) => {
      var item = doc.data();
      returnArr.push(item.batch);
    })
    
    var arr = returnArr;
    setAllBatch([...new Set(arr)])
  }

  const getAllJobs = async () => {
    setAllJobs([])
    const querySnapshot = await getDocs(collection(getFirestore(), "employmentcategories")); 
    var returnArr = [];
    var returnArrColor = [];

    querySnapshot.forEach((doc) => {
      returnArr.push(doc.data().category);
      returnArrColor.push(doc.data().color)
    })

    setAllJobs(returnArr)
    setJobColors(returnArrColor)

    setNumberOfAlumniWithThisProfession([])

    returnArr.map( async (profession) => {
      //select all alumni where profession = profession , verified then add the number of alumni on each profession
      const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Employed"), where("employmentField", "==", `${profession}`),  where("verified", "==",true));
      const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
  
      var returnArr2 = [];

      querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr2.push(item);
      })

      setNumberOfAlumniWithThisProfession((prev) => {
        return[...prev, returnArr2.length]
      });

    })

  }

  const getAllJobsWithBatch = async (value) => {

    setNumberOfAlumniWithThisProfession([])
    
    allJobs.map( async (profession) => {
      //select all alumni where profession = profession , verified then add the number of alumni on each profession
      const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Employed"), where("employmentField", "==", `${profession}`),where('batch', '==', `${value}`),  where("verified", "==",true));
      const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
  
      var returnArr2 = [];

      querySnapshot.forEach((doc) => {
        var item = doc.data();
        returnArr2.push(item);
      })

      setNumberOfAlumniWithThisProfession((prev) => {
        return[...prev, returnArr2.length]
      });

    })

  }

  var data = {
    labels: allJobs,
    datasets: [
      {
        label: '# of Alumni',
        data: numberOfAlumniWithThisProfession,
        backgroundColor: jobColors,
        borderColor: jobColors,
        borderWidth: 1,
      },
    ],
  };

  const SearchAlumniByBatch = async (value) => {
    if(value === '2006-Present'){
      getAllJobs();
    } else {
      setSearchBatch(value);
    }

    getAllJobsWithBatch(value);

  }

  return (
    <div>
        <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow'>
        <p className='font-bold text-slate-500 ml-0 mr-auto'>
          Alumni tracker
        </p>

        </div>

        <div className='w-full bg-white rounded shadow mt-2'>

          <div className='flex w-full justify-center items-center'>
                <AlumniOverview />
          </div>
         
          <div className='w-full flex flex-col justify-center'>
              <p className='font-bold text-fuchsia-700 w-full text-center'>Alumni professions graph</p>

                  <Pie data={data} className="p-20 -mt-20"/> 
              
          </div>

          <div className='flex flex-row p-2'>
                <p className='p-2 mr-auto ml-0 font-bold outline-none text-fuchsia-700 text-lg'>Batch</p>
                <select className='p-2 px-8 border rounded-md ml-auto mr-0 text-fuchsia-700 outline-none' defaultValue={searchBatch} onChange={e => SearchAlumniByBatch(e.target.value)}>
                    <option>2006-Present</option>
                    {
                        allBatch.map((batch) => {
                            return <option>{batch}</option>
                        })
                    }
                </select>

          </div>
        </div>

    </div>
  )
}

export default AlumniTracker