import React, {useEffect, useState} from 'react'
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import defaultProfile from '../assets/defaultimg.png'
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ user, closeToggle }) => {

  const logo = 'https://firebasestorage.googleapis.com/v0/b/cs-alumni-connect.appspot.com/o/images%2Fcs_allumni_logo.2.png?alt=media&token=7a7fca12-0eeb-4182-9340-7563123b9ffd'

  const [userFullname, setUserFullname] = useState(localStorage.getItem('name'))
  const [userProfile, setUserProfile] = useState(localStorage.getItem('photoURL'))
  

  const handleCloseSidebar = () => {
    if(closeToggle) closeToggle(false);
  }

  const categories = [
    { name: 'Create-Announcement' },
    { name: 'All-Announcements' },
    { name: 'Account-Requests' },
    { name: 'Reports' },
    { name: 'Users-Posts' },
    { name: 'Post-Requests' },
    { name: 'Careers' },
    { name: 'Careers-Requests' },
    { name: 'System-Settings' },
    { name: 'All-Chat' },
  ]

  return (
    <div className='flex flex-col justify-between bg-whiteh-full overflow-y-scroll min-w-210 hide-scrollbar h-auto'>
        <div className='flex flex-col'>
          <Link
          to='/'
          className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={handleCloseSidebar}
          >
            <img src={logo} alt="logo" width={200}/>
          </Link>

          <div className='flex flex-col gap-5'>
          <NavLink
              to="/"
              className={({ isActive }) => (isActive ? isActiveStyle: isNotActiveStyle)}
              onClick={handleCloseSidebar}
            >
              <RiHomeFill />
              Home
            </NavLink>
            <h3 className='mt-3 px-5 text-base 2xl:text-xl'>Explore Categories</h3>
              {categories.map((category) => (
              <NavLink
                to={`/category/${category.name}`}
                className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}
                onClick={handleCloseSidebar}
                key={category.name}
              >
                
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
         { user && (
           <Link
            to={`admin-profile/${localStorage.getItem('uid')}`}
            className="flex mt-3 mb-3 gap-2 p-2 items-center bg-white rounded-lg shadow-lg mx-3 "
            onClick={handleCloseSidebar}
           >
             <img src={userProfile} alt='user' className="w-10 h-10 rounded-full"/>
             <p>{userFullname}</p>
           </Link>
         )}
    </div>
  )
}

export default Sidebar