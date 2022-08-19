import React, {useState, useEffect} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getFirestore, where, collection, getDocs, query} from "firebase/firestore"
import { Pie } from 'react-chartjs-2';
import { setAutoFreeze } from 'immer';
import AlumniOverview from './AlumniOverview';

ChartJS.register(ArcElement, Tooltip, Legend);

const AlumniTracker = () => {

    const [totalAlumni, setTotalAlumni] = useState(0)
    const [allAlumniList, setAllAlumniList] = useState([])
    const [employed, setEmployed] = useState(0)
    const [employedList, setEmployedList] = useState([])
    const [unemployed, setUnemployed] = useState(0)
    const [unemployedList, setUnemployedList] = useState([])
    const [underemployed, setUnderemployed] = useState(0)
    const [underemployedList, setUnderemployedList] = useState([])
    const [searchBatch, setSearchBatch] = useState('2006-Present')
    


    const [allBatch, setAllBatch] = useState([])


    useEffect(async () => {
        
        GetAllAlumni();
        GetEmployedAlumni();
        GetUnEmployedAlumni();
        GetUnderEmployedAlumni();
        GetAllBatch();

      }, [])

      const GetAllAlumni = async () => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setTotalAlumni(returnArr.length);
        setAllAlumniList(returnArr)
      }

      const GetEmployedAlumni = async () => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Employed"),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setEmployed(returnArr.length);
        setEmployedList(returnArr)
      }

      const GetUnEmployedAlumni = async () => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Unemployed"),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setUnemployed(returnArr.length);
        setUnemployedList(returnArr)
      }

      const GetRatherNotSayAlumni =async () => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Rather not say"),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setUnderemployed(returnArr.length);
        setUnderemployedList(returnArr)
      }

      const GetAllBatch =async () => {

        setAllBatch([])
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item.batch);
        })
        
        var arr = returnArr;
        setAllBatch([...new Set(arr)])
      }

    const SearchAlumniByBatch = (value) => {
        if(value === '2006-Present'){
            GetAllAlumni();
            GetEmployedAlumni();
            GetUnEmployedAlumni();
            GetUnderEmployedAlumni();
            GetAllBatch();
        } else {
            setSearchBatch(value);
            GetAllAlumniWithBatch(value);
            GetEmployedAlumniWithBatch(value);
            GetUnEmployedAlumniWithBatch(value);
            GetUnderEmployedAlumniWithBatch(value);
        }
    }

    const GetAllAlumniWithBatch = async (batch) => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("verified", "==",true), where("batch", "==", `${batch}`));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setTotalAlumni(returnArr.length);
    }

    const GetEmployedAlumniWithBatch = async (batch) => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"),  where("verified", "==",true), where("employmentStatus", "==", "Employed"), where("batch", "==", `${batch}`));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setEmployed(returnArr.length);
        setEmployedList(returnArr)
    }
    const GetUnEmployedAlumniWithBatch = async (batch) => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Unemployed"), where("batch", "==", `${batch}`),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setUnemployed(returnArr.length);
        setUnemployedList(returnArr)
    }

    const GetUnderEmployedAlumniWithBatch = async (batch) => {
        const queryToOrder = query(collection(getFirestore(), "users"), where("role", "==","Alumni"), where("employmentStatus", "==", "Underemployed"), where("batch", "==", `${batch}`),  where("verified", "==",true));
        const querySnapshot = await getDocs(queryToOrder, collection(getFirestore(), "users"));
    
        var returnArr = [];
        querySnapshot.forEach((doc) => {
          var item = doc.data();
          returnArr.push(item);
        })
        setUnderemployed(returnArr.length);
        setUnderemployedList(returnArr)
    } 
    
      

        const data = {
            labels: ['Employed CS Alumni', 'Underemployed CS Alumni', 'Unemployed CS Alumni'],
            datasets: [
            {
                label: '# of Votes',
                data: [employed, underemployed, unemployed],
                backgroundColor: [
                'rgba(162, 28, 175, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',

                ],
                borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
            ],
        };


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

            <div className='ml-4'>
                <p className='text-fuchsia-700'>Total CS Alumni since (<span className='italic text-rose-500'>{searchBatch}</span>)</p>
            </div>
            <div className='w-full flex justify-center items-center py-2 font-bold text-xl text-fuchsia-900'>
                <p className=''>{totalAlumni}</p>
            </div>
        
            <Pie data={data} className="p-20 -mt-20"/>
        
        </div>

        <div className='bg-white p-4 flex items-center gap-x-2 rounded-md shadow flex-col'>
        <p className='font-bold text-slate-500 ml-0 mr-auto'>
          Raw data
        </p>
        
        <p className='font-bold text-fuchsia-700'>List of all Alumni ({totalAlumni})</p>

        <div className='w-full flex'>
          
        </div>
        </div>

    </div>
  )
}

export default AlumniTracker