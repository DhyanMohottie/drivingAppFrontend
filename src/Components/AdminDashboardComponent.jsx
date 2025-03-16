import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table } from 'flowbite-react'
import { Link } from "react-router-dom"

export default function AdminDashboardComponent() {

  const [users, setUsers] = useState([])
  const [instructors, setInstructors] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalInstructors, setTotalInstructors] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthInstructors, setLastMonthInstructors] = useState(0)
  
  const { currentUser } = useSelector((state) => state.user)

  useEffect(() => {
    const fetchUsers = async () =>{
      try {
        const res = await fetch('api/auth/getusers?limit=5')
        if(res.ok){
          const data = await res.json(); 
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lasthMonthUsers); 
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    const fetchInstructors = async () => {
      try {
        const res = await fetch('api/auth/getinstructors?limit=5')
        if(res.ok){
          const data = await res.json(); 
          setInstructors(data.instructors);
          setTotalInstructors(data.totalInstructors);
          setLastMonthInstructors(data.lasthMonthInstructors); 
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if(currentUser.isAdmin) {
      fetchUsers();
      fetchInstructors();
    }
  }, [currentUser])

  return (
    <div className="p-3 md:mx-auto ">

      <div className="flex-wrap flex gap-4 justify-center">
      <div className="flex flex-col bg-white p-3 gap-4 md:w-72 w-full rounded-md shadow-md ">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase"> Total users </h3>
            <p className="text-2xl"> {totalUsers} </p>
          </div>
          <HiOutlineUserGroup className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500"> Last month </div>
        </div>
      </div>

      <div className="flex flex-col bg-white p-3 gap-4 md:w-72 w-full rounded-md shadow-md ">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase"> Total instructors </h3>
            <p className="text-2xl"> {totalInstructors} </p>
          </div>
          <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg"/>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthInstructors}
            </span>
            <div className="text-gray-500"> Last month </div>
        </div>
      </div>
      </div>

      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col bg-white w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2"> Recent users </h1>
            <Button outline className='bg-blue-200 text-black' > 
              <Link to={'/admin-dashboard?tab=student-management'}> See all  </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell> User ID </Table.HeadCell>
              <Table.HeadCell> User name </Table.HeadCell>
              <Table.HeadCell> User email </Table.HeadCell>
            </Table.Head>
            {users && users.map((user) => (
              <Table.Body key={user._id} className="devide-y">
                <Table.Row className="bg-white">
                  <Table.Cell> {user.userID} </Table.Cell>
                  <Table.Cell> {user.username} </Table.Cell>
                  <Table.Cell> {user.email} </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

        </div>

        <div className="flex flex-col bg-white w-full md:w-auto shadow-md p-2 rounded-md">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2"> Recent instructors </h1>
            <Button outline className='bg-blue-200 text-black' > 
              <Link to={'/admin-dashboard?tab=instructor-registration'}> See all  </Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell> Instructor ID </Table.HeadCell>
              <Table.HeadCell> Instructor name </Table.HeadCell>
              <Table.HeadCell> Instructor email </Table.HeadCell>
            </Table.Head>
            {instructors && instructors.map((instructor) => (
              <Table.Body key={instructor._id} className="devide-y">
                <Table.Row className="bg-white">
                  <Table.Cell> {instructor.InstructorID} </Table.Cell>
                  <Table.Cell> {instructor.InstructorName} </Table.Cell>
                  <Table.Cell> {instructor.email} </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

        </div>
      </div>

      
    </div>
    
  )
}
