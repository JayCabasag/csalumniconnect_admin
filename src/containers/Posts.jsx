import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Feed from '../components/Feed';
import PostDetail from '../components/PostDetail';
import Search from '../components/Search';
import Sidebanner from './Sidebanner';
import CreateAnnouncement from '../components/CreateAnnouncement';
import AllChat from '../components/AllChat'
import AccountsRequests from '../components/AccountsRequests';
import Reports from '../components/Reports';
import AllAnnouncements from '../components/AllAnnouncements';
import AnnouncementDetails from '../components/AnnouncementDetails';
import VerifyUser from '../components/VerifyUser';
import AlumniTracker from '../components/AlumniTracker';
import PostRequests from '../components/PostRequests';
import SystemSettings from '../components/SystemSettings';
import OpportunitiesRequests from '../components/OpportunitiesRequests';
import Opportunities from '../components/Opportunities';
import OpportunityDetails from '../components/OpportunityDetails';


const Posts = ({ user }) => {

  return (
    <div className='px-2 md:px-5'>
        <div className='bg-gray-50 w-full'>
            <Navbar />
        </div>
        <div className='flex w-full h-full'>
        <div className='h-full w-full md:w-3/5'>
          <Routes>
            <Route path="/" element={<AlumniTracker />} />
            <Route path="/category/Users-Posts" element={<Feed />} />
            <Route path="/category/Create-Announcement" element={<CreateAnnouncement />} />
            <Route path="/category/Account-Requests" element={<AccountsRequests />} />
            <Route path="/category/All-Announcements" element={<AllAnnouncements />} />
            <Route path="/category/Post-Requests" element={<PostRequests />} />
            <Route path="/category/Reports" element={<Reports />} />
            <Route path="/category/Careers" element={<Opportunities />} />
            <Route path="/category/Careers-Requests" element={<OpportunitiesRequests />} />
            <Route path="/category/System-Settings" element={<SystemSettings />} />

            <Route path="/post-detail/:postId" element={<PostDetail />} />
            <Route path="/announcement-details/:postId" element={<AnnouncementDetails />} />
            <Route path="/opportunity-details/:postId" element={<OpportunityDetails />} />
            
            <Route path="/account-verification/:userId" element={<VerifyUser />} />

            
          
            <Route path="/category/all-chat" element={<AllChat />} />
            <Route path="/search/:searchTerm" element={<Search />} />  
          </Routes>
        </div>
        <Sidebanner/>
        </div>
        
    </div>
  )
}

export default Posts