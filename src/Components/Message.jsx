import React from 'react';

export default function Message({ messageBody, messageId, date, sender }) {

  return (
    <div className=''>
      <div className='bg-[#002B93] max-w-[330px] h-auto rounded-[10px] p-[12px]'>
      <div className='text-white font-poppins text-[16px] font-light'>{messageBody}</div>
      </div>
    </div>
  );
}