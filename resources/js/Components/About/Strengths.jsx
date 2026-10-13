import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import em from '../../Utils/em'

const StrengthCard = ({ name, description }) => (
  <div className="p-5 bg-slate-100 w-full h-full">
    <div className="flex justify-between items-center w-full">
      <h3 className="text-2xl font-medium tracking-tight text-gray-800">{name}</h3>
    </div>
    <hr className='my-4 border-[#F8B62C] border-2' />
    <span className="text-sm text-gray-600 text-wrap">{description}</span>
  </div>
)

const Strengths = ({ strength, strengths, details }) => {

  const hasDetails = Boolean(details['values.title'] || details['values.description'])

  return (
    <div className={`grid ${hasDetails && 'md:grid-cols-2 lg:grid-cols-5'} gap-8 p-[5%] w-full`}>
      {
        hasDetails &&
        <div className="lg:col-span-2 w-full">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl tracking-tighter leading-tight font-bold text-gray-600">
              {em(details['values.title'])}
            </h2>
            <p className="mt-6 text-base md:text-lg leading-7 text-gray-600">
              {em(details['values.description'])}
            </p>
          </div>
          <a href='/courses' className="flex gap-2 items-center px-6 py-4 mt-10 text-base font-medium tracking-normal text-white uppercase rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300 w-max">
            CURSOS Y TALLERES
            <i className='mdi mdi-arrow-top-right ms-1'></i>
          </a>
        </div>
      }
      <div className="lg:col-span-3 w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 3000, // Cambia el tiempo de retraso (en milisegundos)
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: hasDetails  ?1: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: hasDetails? 2:3,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: hasDetails?3 : 4,
              spaceBetween: 32,
            },
          }}
          className='w-full'
        >
          {strengths.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              <StrengthCard {...item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default Strengths