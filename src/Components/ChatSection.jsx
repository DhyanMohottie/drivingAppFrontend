import React, { useEffect, useState } from 'react';
import Message from './Message';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { io } from "socket.io-client";
import axios from 'axios';

const user = '66283ef81df4567e1d703370';

export default function ChatSection() {

    const [userTopics, setUserTopics] = useState([]);
    const [otherTopics, setOtherTopics] = useState([]);
    const [groups, setgroups] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [showGroups, setShowGroups] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [editMessage, setEditmessage] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageText, setMessageText] = useState('');
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [showButtonsForMessage, setShowButtonsForMessage] = useState({});
    const [messages, setmessages] = useState([]);
    const [currentGroup, setcurrentGroup] = useState('')

    const user = '66283ef81df4567e1d703370';
    
    const fetchgroups = async () => {
      const response = await axios.get(`http://localhost:3000/chat/getallgroups`);
      setgroups(response.data.groups)
      console.log(groups)
    };

    const fetchMessages = async (groupId) => {
      console.log(groupId)
      setcurrentGroup(groupId);
      const response = await axios.post(`http://localhost:3000/chat/getmessages`, { group: groupId });
      setmessages(response.data.messages)
      console.log('messages', messages)
    };

  const handleNewTopicClick = () => {
    setShowInput(!showInput);
  };
  
  const handleSendClick = async () => {
    if(groupName != ''){
      const adminId = user;
      const groupData = {
        name: groupName, 
        admin: adminId
      }
      const response = await axios.post(`http://localhost:3000/chat/creategroup`, groupData);
      console.log(response)
      setShowInput(false);
    }else {
      alert('Group name is required.')
    }
  };  

  const chat = async () => {
    if(messageText != ''){
      if (!editMessage) {
        if(currentGroup == ''){
          alert('Select a group')
        }else {
          const messageData = {
            content: messageText,
            sender: user,
            group: currentGroup
          };
          const response = await axios.post(`http://localhost:3000/chat/sendmessage`, messageData);
          setMessageText('');
        }
      } else {
          const updateMessageData = {
              messageId: currentMessage,
              content: messageText
          };
          const response = await axios.post(`http://localhost:3000/chat/updatemessage`, updateMessageData);
          setMessageText('');
      }
    } else {
      alert(`You can't send empty messages.`)
    } 
    
  };


  const handleRightClick = (messageId) => {
    setShowButtonsForMessage(prevState => ({
      ...prevState,
      [messageId]: true
    }));
  };

  const handleClickOutside = () => {
    setShowButtonsForMessage({});
  };

  const handleDeleteClick = async (messageId) => {
    console.log(messageId)
    const response = await axios.delete(`http://localhost:3000/chat/deletemessage/${messageId}`);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    if (value) {
      setShowGroups(true);
      const filteredGroups = groups.filter(group => {
        return group.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredGroups(filteredGroups);
      console.log('filtered grouos', filteredGroups)
    } else {
      setShowGroups(false);
    }
  };  

  const handleInputFocus = () => {
    setShowGroups(true); 
  };

  const handleInputBlur = () => {
    setShowGroups(false);
    setFilteredGroups([]);
  };

  useEffect(() => {
    fetchgroups();

    const updatedUserTopics = [];
    const updatedOtherTopics = [];

    groups.forEach(group => {
        if (group.admin === user) {
            updatedUserTopics.push(group);
        } else {
            updatedOtherTopics.push(group);
        }
    });

    setUserTopics(updatedUserTopics);
    setOtherTopics(updatedOtherTopics);

  }, [groups]);  

  return (
    <div className='flex justify-center'>
      <div className='m-[50px] font-poppins flex flex-col gap-[20px]'>
        <div className='flex flex-col justify-start items-start'>
          <div className='font-[500] mb-[20px] text-[20px]'>Your topics</div>
          <div className="flex items-start flex-col justify-center gap-[15px]">
            {userTopics.map(group => (
              <button key={group._id} onClick={()=>{fetchMessages(group._id);}} className='flex items-start justify-start gap-[20px]'>
                <div className="w-[20px] h-[20px] bg-[#002B93] rounded-full bg-blue"></div>
                <div className='w-[262px] h-[27px] text-left overflow-x-auto no-scrollbar whitespace-nowrap'>{group.name}</div>
              </button>
            ))}
          </div>
        </div>
        <div className='flex flex-col justify-start items-start'>
          <div className='font-[500] mb-[20px] text-[20px]'>Other topics</div>
          <div className="flex items-start flex-col justify-center gap-[15px]">
            {otherTopics.map(group => (
              <button key={group._id} onClick={()=>{fetchMessages(group._id);}} className='flex items-center justify-center gap-[20px]'>
                <div className="w-[20px] h-[20px] bg-[#002B93] rounded-full bg-blue"></div>
                <div className='max-w-[262px] h-[27px] overflow-x-auto no-scrollbar whitespace-nowrap'>{group.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-[30px] m-[50px]'>     
        <div className='flex justify-center items-center gap-[20px]'>
          <div className='w-full rounded-full '>
            <TextField
              id="outlined-textarea"
              label="Search Topics"
              placeholder="Search Topics"
              multiline
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className='w-full'
              InputLabelProps={{
                sx: {
                  fontFamily: 'Poppins',
                  '&.Mui-focused': {
                    color: '#000000',
                    fontFamily: 'Poppins',
                  }
                }
              }}
              InputProps={{
                sx: {
                  overflow: 'hidden',
                  fontFamily: 'Poppins',
                  borderRadius: 100,
                  height: 57,
                  '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#000000', 
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000', 
                  }
                }
              }}
            />  
          </div> 
          <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#002B93', color: 'white', height: '50px', borderRadius: '50px', fontSize: '18px', fontFamily: 'Poppins', width: '150px' }}
                onClick={handleNewTopicClick}
              >
                New Topic
            </Button>
          </div>
        </div>

        {showGroups && filteredGroups.map((group) => (
            <div key={group._id}>
              <button onClick={() => {fetchMessages(group._id); setShowGroups(false)}} className='font-poppins'>{group.name}</button>
            </div>
        ))}

        {showInput && (
            <div className='flex h-[57px] gap-[21px] justify-center items-center'>
              <div className='w-full rounded-full'>
                <TextField
                  id="outlined-textarea"
                  label="Enter Group Name"
                  placeholder="Enter Group Name"
                  multiline
                  className='w-full'
                  onChange={(e) => {setGroupName(e.target.value);}}
                  InputLabelProps={{
                    sx: {
                      fontFamily: 'Poppins',
                      '&.Mui-focused': {
                        color: '#000000',
                        fontFamily: 'Poppins',
                      }
                    }
                  }}
                  InputProps={{
                    sx: {
                      overflow: 'hidden',
                      fontFamily: 'Poppins',
                      borderRadius: 100,
                      height: 57,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000', 
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#000000', 
                      }
                    }
                  }}
                />
              </div>
              <button className='bg-[#002B93] rounded-full w-[55px] h-[50px] flex justify-center items-center' onClick={handleSendClick}>
                <SendIcon style={{ color: '#ffffff' }} />
              </button>
            </div>
          )}

        <div className={`border-[1px] rounded-[10px] w-[696px] h-[656px] flex flex-col gap-[30px] p-[50px] overflow-auto no-scrollbar`}>
          {messages.map(message => (
            <div 
              key={message._id} 
              className={`flex ${message.sender === user ? 'justify-end' : 'justify-start'}`}
              onContextMenu={() => handleRightClick(message._id)}
            >
              <Message
                messageBody={message.content}
                messageId={message._id}
                date={message.createdAt}
                sender={message.sender}
              />
              {showButtonsForMessage[message._id] && (
                <div className='flex flex-col justify-start items-start gap-[5px] ml-[5px]'>
                  <button 
                    className='p-[5px] px-[20px] rounded-[100px] hover:shadow-md' 
                    onClick={() => {handleDeleteClick(message._id); handleClickOutside()}}
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => {setEditmessage(true); setCurrentMessage(message._id); setMessageText(message.content); handleClickOutside();}}
                    className='p-[5px] px-[20px] rounded-[100px] hover:shadow-md'
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      
        <div className='flex h-[57px] gap-[21px] justify-center items-center'>
          <div className='w-full rounded-full '>
            <TextField
              id="outlined-textarea"
              label="Type your message here..."
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => {setMessageText(e.target.value)}}
              multiline
              className='w-full'
              InputLabelProps={{
                sx: {
                  fontFamily: 'Poppins',
                  '&.Mui-focused': {
                    color: '#000000',
                    fontFamily: 'Poppins',
                  }
                }
              }}
              InputProps={{
                sx: {
                  overflow: 'hidden',
                  fontFamily: 'Poppins',
                  borderRadius: 100,
                  height: 57,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000', 
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000', 
                  }
                }
              }}
            />  
          </div>
          <button onClick={() => {chat();}} className='bg-[#002B93] rounded-full w-[55px] h-[50px] flex justify-center items-center'>
            <SendIcon style={{ color: '#ffffff' }} />
          </button>
        </div>
      </div>
    </div>
  );
}