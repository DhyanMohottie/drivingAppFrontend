import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import instance from '../api';

export default function Chatbot() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState([]);

  const handleSubmit = async () => {
    try {
      const response = await instance.post('/chatbot/response', { question: prompt });

      setResponses([...responses, { role: 'user', content: prompt }, { role: 'bot', content: response.data.response }]);
      console.log(response)
      setPrompt('');
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className='flex flex-col justify-center items-center font-poppins p-[30px]'>
      <div className='text-[25px] p-[10px]'>Chat with AI</div>
      <div className='border-[1px] rounded-[10px] w-[696px] h-[500px] flex flex-col gap-[30px] p-[50px] overflow-auto no-scrollbar'>
        {responses.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`bg-${message.role === 'user' ? 'blue' : 'green'} w-[400px] text-white bg-[#002B93] rounded-[10px] p-[10px] text-left`}>{message.content}</div>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center mt-[30px] gap-[40px] w-[696px]'>
        <TextField
          id="outlined-textarea"
          label="Type your message here..."
          placeholder="Type your message here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ backgroundColor: '#002B93', color: 'white', height: '50px', borderRadius: '50px', fontSize: '18px', fontFamily: 'Poppins', width: '200px' }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
