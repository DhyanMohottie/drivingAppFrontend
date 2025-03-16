import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiUsers } from 'react-icons/hi';
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { MdAppRegistration, MdFormatListBulletedAdd, MdRateReview  } from "react-icons/md";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export default function AdminSidebar() {

  const{currentUser} = useSelector(state => state.user);
  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch(); 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
    });
    const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          
          <Link to={currentUser.isAdmin ? '/admin-dashboard?tab=admin-edit-profile' : '/user-dashboard?tab=edit-profile'}>
            <Sidebar.Item
              active={tab === 'edit-profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : (currentUser.isStudent ? 'Student' : (currentUser.isInstructor ? 'Instructor' : 'Unknown'))}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {/* <Link to={currentUser.isInstructor  ? '/trainingSesssion' : '/trainingSesssion'}>Physical Training Session</Link> */}
          {/* <Link to={currentUser.isAdmin  ? '/revenue' : '/revenue'}>Revenue Page</Link> */}
          {currentUser.isAdmin && (
            <Link to='/admin-dashboard?tab=dashboard'>
            <Sidebar.Item
              active={tab === 'dashboard'}
              icon={TbDeviceDesktopAnalytics}
              as='div'
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          )}
          

          {currentUser.isAdmin && (
            <Link to='/admin-dashboard?tab=student-management'>
            <Sidebar.Item
              active={tab === 'student-management'}
              icon={HiUsers}
              as='div'
            >
              Users
            </Sidebar.Item>
          </Link>
          )}
          

          {currentUser.isAdmin && (
            <Link to='/admin-dashboard?tab=instructor-registration'>
            <Sidebar.Item
              active={tab === 'instructor-registration'}
              icon={MdAppRegistration }
              as='div'
            >
              Instructors
            </Sidebar.Item>
          </Link>
          )}
          

          {currentUser.isAdmin && (
            <Link to='/admin-dashboard?tab=add-licensepkg'>
            <Sidebar.Item
              active={tab === 'add-licensepkg'}
              icon={MdFormatListBulletedAdd }
              as='div'
            >
              License Packages
            </Sidebar.Item>
          </Link>
          )}

          {currentUser.isAdmin && (
            <Link to='/vehicles/home'>
            <Sidebar.Item
              active={tab === 'add-licensepkg'}
              icon={MdFormatListBulletedAdd }
              as='div'
            >
              Vehicles
            </Sidebar.Item>
          </Link>
          )}

          {currentUser.isAdmin && (
            <Link to='/revenue'>
            <Sidebar.Item
              active={tab === 'add-licensepkg'}
              icon={MdFormatListBulletedAdd }
              as='div'
            >
              Revenue
            </Sidebar.Item>
          </Link>
          )}
          {currentUser.isInstructor && (
            <Link to='/quizmain'>
            <Sidebar.Item
              active={tab === 'add-licensepkg'}
              icon={MdFormatListBulletedAdd }
              as='div'
            >
              Quiz Page
            </Sidebar.Item>
          </Link>
          )}

          {currentUser.isInstructor && (
            <Link to='/trainingSesssion'>
            <Sidebar.Item
              active={tab === 'add-licensepkg'}
              icon={MdAppRegistration}
              as='div'
            >
             Physical Training Session
            </Sidebar.Item>
          </Link>
          )}
          
          
          <Sidebar.Item
            icon={HiArrowSmRight} onClick={handleSignOut} className='cursor-pointer'
            
          >
            Sign Out
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
