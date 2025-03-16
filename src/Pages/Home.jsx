import React from 'react';
import DisplayLicensePackages from '../Components/DisplayLicensePackages'
import FeedbackForm from '../Components/AddReview'
import HeroImage from '../assets/Home/Hero.png'
import QuizImage from '../assets/Home/quizimage.png'
import TrainingImage from '../assets/Home/trainingimage.png'

export default function Home() {
  return (
    <>   
      <div className='font-poppins'>
        <div className='flex justify-center'> <img src={HeroImage} className='my-[10px]'/> </div>
        <div className='flex justify-center mt-[112px] mb-[67px] items-center gap-[10px]'>
            <div className='bg-[#EE8F00] w-[39px] h-[39px]'></div>
            <div className='font-poppins text-[55px] font-[700]'>Services</div>
        </div>
        <div className='flex flex-col gap-[90px]'>
          <div className='flex flex-col gap-[32px]'>
            <div className='flex justify-center items-center gap-[32px]'>
              <div className='flex justify-start items-start flex-col w-[488px] gap-[32px]'>
                <div className='text-[40px] font-[700]'>Enroll to our quizzes</div>
                <div className='text-left'>Lorem djdkd  ere hdd of backen nzdnd jdnd vfsgs gsgsc  dfmdjj jgfdyf ddhd gfdf  dgdhd hdhfdf hfjf hfhf ljlj saa wqwy kvkf kcmcnc </div>
              </div>
              <div>
                <img src={QuizImage} />
              </div>
            </div>
          </div>
          <div className=' flex flex-col gap-[32px]'>
            <div className='flex flex-row-reverse justify-center items-center gap-[32px]'>
              <div className='flex justify-end items-end flex-col w-[488px] gap-[32px]'>
                <div className='text-[40px] font-[700]'>Enroll to our quizzes</div>
                <div className='text-right'>Lorem djdkd  ere hdd of backen nzdnd jdnd vfsgs gsgsc  dfmdjj jgfdyf ddhd gfdf  dgdhd hdhfdf hfjf hfhf ljlj saa wqwy kvkf kcmcnc </div>
              </div>
              <div>
                <img src={TrainingImage} />
              </div>
            </div>
          </div>
        </div> 
        <div className='flex justify-center mt-[112px] mb-[40px] items-center gap-[10px]'>
            <div className='bg-[#EE8F00] w-[39px] h-[39px]'></div>
            <div className='font-poppins text-[55px] font-[700]'>About Us</div>
        </div>  
        <div className='flex justify-center items-center'>
          <div className='text-center w-[1008px]'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
          </div>
        </div>    
      </div>

      <div className="mt-4"> <FeedbackForm /> </div>
    </>
  );
}