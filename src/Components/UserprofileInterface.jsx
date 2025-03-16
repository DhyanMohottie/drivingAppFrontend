import React from 'react'
import UserSideBar from './UserSideBar'
// import img from '../assets/chart.jpg'
import { useNavigate } from 'react-router-dom'

function UserprofileInterface() {

    const Navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('user'));

  return (

    <div className='flex flex-row'>
        <UserSideBar/>
        <div>
        <div>
            <h1 className="my-8 mx-8 text-xl font-bold">Helo {userData.firstName}</h1>
            <hr/>
        </div>
        {/* <div>
            <img src={img} alt=""/>
        </div> */}
        <div class="p-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-7 rounded mx-8">Book a Training session</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-7 rounded mx-8" onClick={()=> Navigate("/payment")}>Make a Payment</button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-7 rounded mx-8">Learning metteral</button>
        </div>
        </div>
    </div>
    
  )
}

export default UserprofileInterface