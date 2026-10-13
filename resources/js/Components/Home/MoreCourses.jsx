import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CourseCard from "../Courses/CourseCard";
import em from "../../Utils/em";

const MoreCourses = ({ courses, details }) => {
  const swiperRef = useRef(null);

  return (
    <div className="p-[5%] flex flex-col justify-center bg-white">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-tight text-slate-700">
        {em(details?.['courses.title'])}
      </h2>
      {
        details?.['courses.description'] &&
        <div className="mt-2 text-sm leading-5 text-gray-700">
          {em(details?.['courses.description'])}
        </div>
      }

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={2}
        spaceBetween={16}
        // navigation={{
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev",
        // }}
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
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 32,
          },
        }}
        className="mt-8 md:mt-14 w-full"
      >
        {courses.map((course, index) => (
          <SwiperSlide key={index}>
            <CourseCard {...course} clickable />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-6 gap-4">
        <button
          className="swiper-button-prev flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md"
          aria-label="Previous slide"
        >
          <i className="mdi mdi-arrow-left"></i>
        </button>
        <button
          className="swiper-button-next flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md"
          aria-label="Next slide"
        >
          <i className="mdi mdi-arrow-right"></i>
        </button>
      </div>

      <a
        href="/courses"
        className="flex gap-2 justify-center items-center self-center md:self-end px-6 py-4 mt-8 md:mt-14 text-base font-medium tracking-normal leading-none text-white uppercase rounded-3xl bg-[#2E405E] hover:bg-[#1E2A3E] transition-colors duration-300"
      >
        <span>ver todos los cursos y diplomados</span>
        <i className="mdi mdi-arrow-top-right"></i>
      </a>
    </div>
  );
};

export default MoreCourses;
