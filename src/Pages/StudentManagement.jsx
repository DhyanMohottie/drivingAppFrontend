import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal } from 'flowbite-react';
import { HiOutlineExclamation } from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';

export default function StudentManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const ComponentsRef = useRef();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`/api/auth/getUsers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error('Failed to fetch students');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchStudents();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`api/auth/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/auth/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      new Date(user.updatedAt).toLocaleDateString().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: 'Student Report',
  });

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 p-9'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <div className='p-3 flex items-center justify-between'>
            <input
              type='search'
              placeholder='Search...'
              className='bg-transparent focus:outline-none w-24 sm:w-64'
              value={searchTerm}
              onChange={onChange}
            />

            <button onClick={handlePrint} className='bg-teal-200 text-black p-3 rounded-lg uppercase hover:opacity-80'> Download Report </button>

          </div>

          <div ref={ComponentsRef}>

          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Gender</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>PhoneNumber</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell> 
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className='divide-y'>
              {filteredUsers.map((user) => (
                <Table.Row key={user._id} className='bg-white '>
                  <Table.Cell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.userID}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.username}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.gender}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.email}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.phoneNumber}
                  </Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>
                    {user.address}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table> </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have not added any license packages yet!</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
          <Modal.Body className='text-center'>
            <HiOutlineExclamation className='h-14 w-14 text-gray-400 mb-4 mx-auto dark:text-gray-200' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this student account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm Sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </Modal.Body>
      </Modal>
    </div>
  );
}
