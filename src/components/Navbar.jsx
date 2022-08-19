import React, {useState, useEffect}from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';

const Navbar = ({searchTerm, setSearchTerm, user }) => {
  
  const navigate = useNavigate({ user });
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfile, setUserProfile] = useState(localStorage.getItem('photoURL'))
  

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border outline-none focus-within:shadow-small'>
        <IoMdSearch fontSize={21} className="ml-1"/>
          <input 
          type="text" 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 w-full bg-white outline-none'
          />
      </div>

      <div className='flex gap-3'>
          <Link
            to={`admin-profile/${localStorage.getItem('uid')}`}
            className="hidden md:block"
          >
            <img src={userProfile} alt="user" className='w-14 h-12 rounded-lg'/>
          </Link>

      </div>

      


    </div>
  )
}

export default Navbar