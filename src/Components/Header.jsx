import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {

  const [user, setuser] = useState({})

  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setuser(user);
    console.log(user, 'user header')
  }, [])

  return (

    <div className={`flex flex-col justify-center items-center font-poppins gap-[30px] mb-[50px]`}>
      <div className={`flex justify-center items-center ${currentUser || user ? '' : 'gap-[600px]'}`}>
        <div className='text-[50px] font-[800] font-poppins'><Link to='/'>SARASAVI</Link></div>
        <div>
          {
            user || currentUser ? (
              <div></div>
            ):(
              <div className='flex items-center gap-[84px]'>
                <div className='font-[4000] text-[22px]'><Link to='/sign-in'>Admin Login</Link></div>
                <div className='font-[4000] text-[22px]'><Link to='/user/sign-up'>Register</Link></div>
                <div className='text-white bg-[#002B93] rounded-full font-[400] py-[5px] px-[30px] text-[22px]'><Link to='/user/sign-in'>Login</Link></div>
              </div>
            )
          }
        </div>
      </div>
      {
        currentUser && currentUser.isAdmin ? (
          <div></div>
        ) : (
          <div className='flex justify-center items-center gap-[80px] text-[22px]'>
            <div className={`hover:font-[500]`}><Link to='/'>Home</Link></div>
            <div className={`hover:font-[500]`}><Link to='/'>About US</Link></div>
            <div className={`hover:font-[500]`}><Link to='/'>Contact US</Link></div>
            <div className={`hover:font-[500]`}><Link to='/user/interface'>User Dashboard</Link></div>
            <div className={`hover:font-[500]`}><Link to='/chat'>Chat</Link></div>
            <div className={`hover:font-[500]`}><Link to='/chatbot'>Chatbot</Link></div>
          </div>
        )
      }
    </div>

    // <header className='bg-slate-200 shadow-md'>
    //   <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
    //     <Link to='/'>
    //       <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
    //         <span className='text-slate-500'>Sarasavi</span>
    //         <span className='text-slate-700'>Learners</span>
    //       </h1>
    //     </Link>


    //     <ul className='flex gap-4'>
    //       <Link to='/'>jjjjjjjjjgggggg
    //         <li className='text-slate-700 hover:underline'>
    //           Home
    //         </li>
    //       </Link>
          
    //       <Link to='/admin-dashboard'>
    //         {currentUser ? (
    //             <span className="text-slate-700 hover:underline"> Dashboard </span>
    //         ) : (
    //           <li className='text-slate-700 hover:underline'> Sign in </li>
    //         )}
    //       </Link>



    //     </ul>
    //   </div>
    // </header>
  );
}
