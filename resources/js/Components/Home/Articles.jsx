'use client'

import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import PostCard from '../Blog/PostCard'
import em from '../../Utils/em'

const Articles = ({ articles, details }) => {
  const swiperRef = useRef(null)

  return (
    <section className="flex overflow-hidden flex-col justify-center p-[5%] bg-slate-100">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-slate-700">
        {em(details?.['blog.title'])}
      </h2>
      {
        details?.['blog.description'] &&
        <div className="mt-2 text-sm leading-5 text-gray-700">
          {em(details?.['blog.description'])}
        </div>
      }
      <div className="flex flex-col justify-center w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-6 justify-between items-center w-full max-md:max-w-full">
          <div className="flex gap-3 justify-center items-center self-stretch my-auto">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="swiper-button-prev flex relative shrink-0 self-stretch my-auto w-7 h-7 items-center justify-center bg-white rounded-full shadow-md"
              aria-label="Previous slide"
            >
              <i className="mdi mdi-arrow-left"></i>
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="swiper-button-next flex relative shrink-0 self-stretch my-auto w-7 h-7 items-center justify-center bg-white rounded-full shadow-md"
              aria-label="Next slide"
            >
              <i className="mdi mdi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper
        }}
        slidesPerView={2}
        spaceBetween={16}
        pagination={{
          type: 'progressbar',
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        loop={true}
        autoplay={{
          delay: 3000, // Cambia el tiempo de retraso (en milisegundos)
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
        }}
        className="mt-8 w-full"
      >
        {articles.map((item, index) => (
          <SwiperSlide key={index}>
            <PostCard {...item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 sm:mt-8 md:mt-10">
        <a
          href="/blog"
          className="rounded-full px-4 py-1.5 bg-[#2e405e] text-white text-sm sm:text-base transition-colors duration-300 hover:bg-[#1f2b3e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e405e] cursor-pointer"
        >
          Ver todas las noticias
          <i className="mdi mdi-arrow-top-right ms-1"></i>
        </a>
      </div>
    </section>
  )
}

export default Articles
