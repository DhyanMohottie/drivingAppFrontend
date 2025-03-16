import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Button, Textarea } from 'flowbite-react';

const Star = ({ totalStars, rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='flex items-center'>
      {renderStars()}
    </div>
  );
};

const Review = ({ review, onEdit, onDelete, onReply }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(review.content);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replies, setReplies] = useState([]);

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await fetch(`/api/auth/${review.userID}`);
  //       if (res.ok) {
  //         const data = await res.json();
  //         setUser(data);
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   getUser();
  // }, [review.userID]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/auth/editReview/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedContent
        })
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit({ ...review, content: editedContent });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReply = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyContent('');
  };

  const handleSaveReply = async () => {
    try {
      const res = await fetch(`/api/auth/replyToReview/${review._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: review._id,
          reply: replyContent
        })
      });
      if (res.ok) {
        setIsReplying(false);
        setReplyContent('');
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const onDeleteReply = async (replyId) => {
    try {
      const res = await fetch(`/api/auth/deleteReply/${review._id}/${replyId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        window.location.reload();
        setReplies((prevComments) => {
          const updatedComments = prevComments.map((comment) => {
            if (comment._id === review._id) {
              return {
                ...comment,
                replies: comment.replies.filter((reply) => reply._id !== review._id),
              };
            }
            return comment;
          });
          return updatedComments;
        });
      } else {
        throw new Error('Failed to delete reply');
      }
    } catch (error) {
      console.error('Error deleting reply:', error.message);
    }
  };
  
  

  return (
    <div className='flex p-4 border-b text-sm'>
      <div className='flex-1'>
        <div className='flex items-center mb-1 gap-1'>
          {/* <span className='font-bold me-1 text-xs truncate'>{user ? `@${user.username}` : 'Anonymous User'}</span> */}
          <span className='font-bold me-1 text-xs truncate'> Anonymous User </span>
          <Star totalStars={5} rating={review.rating} />
          <span className='text-gray-500 text-xs'>{moment(review.createdAt).fromNow()}</span>
        </div>

        {isEditing ? (
          <>
            <Textarea
              className='mb-2'
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            <div className='flex justify-end gap-2 text-xs'>
              <Button
                className='bg-green-100 text-black'
                type='button'
                size='sm'
                onClick={handleSave}
              >
                Save
              </Button>

              <Button
                type='button'
                size='sm'
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className='flex text-gray-500 pb-2'>{review.content}</p>

            <div className='flex items-center pt-2 text-xs border-t max-w-fit gap-2'>
              {currentUser && (currentUser._id === review.userID || currentUser.isAdmin) && (
                <>
                  {currentUser.isAdmin ? (
                    <button
                      type='button'
                      className='text-gray-400 hover:text-blue-500'
                      onClick={handleReply}
                    >
                      Reply
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='text-gray-400 hover:text-blue-500'
                      onClick={handleEdit}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type='button'
                    className='text-gray-400 hover:text-red-500'
                    onClick={() => onDelete(review._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </>
        )}

    {isReplying && (
      <div className='mt-2'>
        <Textarea
          className='mb-2'
          placeholder='Write a reply...'
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <div className='flex justify-end gap-2 text-xs'>
          <Button
            className='bg-blue-500 text-white'
            type='button'
            onClick={handleSaveReply}
          >
            Reply
          </Button>
          <Button
            type='button'
            outline
            onClick={handleCancelReply}
          >
            Cancel
          </Button>
        </div>
      </div>
    )}

    {review.replies && review.replies.length > 0 && (
      <div className='mt-2 pl-6  border-gray-300'>
        {review.replies.map((reply, index) => (
          <div key={index} className="flex items-center justify-between">
            <p className='text-gray-500'>
              <span className='font-semibold'>
                Admin:
              </span> {reply.reply}
            </p>
            {currentUser && (currentUser._id === reply.userID || currentUser.isAdmin) && (
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  className='text-gray-400 hover:text-red-500'
                  onClick={() => onDeleteReply(reply._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}

      </div>
    </div>
  );
};

export default Review;
