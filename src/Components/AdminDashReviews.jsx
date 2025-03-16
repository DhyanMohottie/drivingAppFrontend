import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal } from 'flowbite-react';
import { HiOutlineExclamation } from 'react-icons/hi';

export default function AdminDashReviews() {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/auth/getReviews`);
        const data = await res.json();
        if (res.ok) {
          setReviews(data.reviews);
          if(data.reviews.length < 9){
            setShowMore(false);
          }

        } else {
          throw new Error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchReviews();
    }
  }, [currentUser._id, currentUser.isAdmin]);

    const handleShowMore = async () => {
      const startIndex = reviews.length;
      try {
        const res = await fetch(`/api/auth/getReviews?startIndex=${startIndex}`);
        const data = await res.json();
        if (res.ok) {
          setReviews((prev) => [...prev, ...data.reviews]);
          if (data.reviews.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error){
        console.log(error.message);
      }
    };
    
    const handleDeleteReview = async () => {
      setShowModal(false);
      try {
        const res = await fetch(`/api/auth/delete/${reviewIdToDelete}`,
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          setReviews((prev) => 
            prev.filter((user) => user._id !== reviewIdToDelete)
          );
        }

      } catch (error) {
        console.log(error.message);
      }

    };



  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 p-9 '>
      {currentUser.isAdmin && reviews.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Review</Table.HeadCell>
              <Table.HeadCell>Rating</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            
            <Table.Body className='divide-y'>
              {reviews.map((review) => (
                <Table.Row key={review._id} className='bg-white '>
                  <Table.Cell>{new Date(review.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>{review.userID}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>{review.content}</Table.Cell>
                  <Table.Cell className='font-medium text-gray-900'>{review.rating}</Table.Cell>
                  
                  <Table.Cell>
                    <span 
                      onClick={() => {
                        setShowModal(true);
                        setReviewIdToDelete(review._id);
                      }} 
                      className='font-medium text-red-500 hover:underline cursor-pointer'> 
                      Delete 
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                Show more
              </button>
            )
          }
        </>

      ) : (
        <p>You have no reviews yet!</p>
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
            Are you sure you want to delete this review?
          </h3>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={handleDeleteReview} >
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
