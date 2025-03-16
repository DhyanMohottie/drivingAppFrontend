import React, { useEffect, useState } from 'react';
import { fetchGroups, fetchMessages } from '../features/chat/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'

export default function ChatTopics() {
    const dispatch = useDispatch();
    const [userTopics, setUserTopics] = useState([]);
    const [otherTopics, setOtherTopics] = useState([]);

    const [groups, setgroups] = useState([]);

    const user = '66283ef81df4567e1d703370';
    
    const fetchgroups = async () => {
        const response = await axios.get(`http://localhost:3000/chat/getallgroups`);
        setgroups(response.data.groups)
        console.log(groups)
    }
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
    
    // useEffect(() => {
    //     const updatedUserTopics = [];
    //     const updatedOtherTopics = [];

    //     groups.forEach(group => {
    //         if (group.admin === user) {
    //             updatedUserTopics.push(group);
    //         } else {
    //             updatedOtherTopics.push(group);
    //         }
    //     });

    //     setUserTopics(updatedUserTopics);
    //     setOtherTopics(updatedOtherTopics);
    // }, [groups, user]);

    return (
        <div className='m-[50px] font-poppins flex flex-col gap-[20px]'>
            <div>
                <div className='font-[500] mb-[20px] text-[20px]'>Your topics</div>
                <div className="flex items-start flex-col justify-center gap-[15px]">
                    {userTopics.map(group => (
                        <button key={group._id} onClick={()=>{dispatch(fetchMessages(group._id));}} className='flex items-start justify-start gap-[20px]'>
                            <div className="w-[20px] h-[20px] bg-blue-500 rounded-full bg-blue"></div>
                            <div className='w-[262px] h-[27px] text-left overflow-x-auto no-scrollbar whitespace-nowrap'>{group.name}</div>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <div className='font-[500] mb-[20px] text-[20px]'>Other topics</div>
                <div className="flex items-start flex-col justify-center gap-[15px]">
                    {otherTopics.map(group => (
                        <button key={group._id} onClick={()=>{dispatch(fetchMessages(group._id));}} className='flex items-center justify-center gap-[20px]'>
                            <div className="w-[20px] h-[20px] bg-blue-500 rounded-full bg-blue"></div>
                            <div className='max-w-[262px] h-[27px] overflow-x-auto no-scrollbar whitespace-nowrap'>{group.name}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
        );
    }