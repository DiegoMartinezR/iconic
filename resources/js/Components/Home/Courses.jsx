import React, { useState } from "react";

const Courses = ({ courses }) => {
  const [activeCourse, setActiveCourse] = useState(courses[0].id);

  const toggleCourse = (id) => {
    if (id === activeCourse) return;
    setActiveCourse(id);
  };

  const VerticalTitle = ({ title }) => (
    <div className="hidden md:flex flex-col items-center overflow-hidden h-full">
      <div className="origin-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px] [writing-mode:vertical-lr]">
        {title}
      </div>
    </div>
  );

  const titleContainer = ({ index, title }) => (
    <div
      className={`flex flex-col items-center justify-start p-4 w-full md:w-20 md:h-[300px]`}
    >
      <p className="text-2xl mb-4 font-bold">{String(index + 1).padStart(2, '0')}.</p>
      <div className="md:hidden truncate max-w-full">
        <p className="text-xs font-bold truncate">{title}</p>
      </div>
      <VerticalTitle title={title} />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row w-full bg-[#F8B62C] snap-start h-max">
      <div className="flex flex-col md:flex-row w-full">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className={`md:flex cursor-pointer transition-all duration-300 ${activeCourse === course.id
              ? "w-full"
              : "w-full md:w-20 h-full md:h-auto"
              }`}
            onClick={() => toggleCourse(course.id)}
          >
            {titleContainer({ index, title: course.name })}

            {activeCourse === course.id && (
              <div className="flex flex-col bg-white w-full transition-all duration-300 overflow-x-auto cursor-default">
                <div className="p-[5%]">

                  <div className="text-lg font-semibold">
                    <span className="font-bold">{String(index + 1).padStart(2, '0')}.</span>
                    <a href={`/courses/${course.id}`} className="ms-1">
                      {course.name}
                      <i className="mdi mdi-arrow-top-right ms-1"></i>
                    </a>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-16 mx-auto w-full pt-[5%]">
                      <div className="flex flex-col space-y-1">
                        <h3 className="text-xs font-medium text-pink-500">Sesiones</h3>
                        <p className="text-base font-semibold text-blue-900">{course.sessions} sesiones - {course.type}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <h3 className="text-xs font-medium text-pink-500">Certificado</h3>
                        <p className="text-base font-semibold text-blue-900">{course.certificate}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <h3 className="text-xs font-medium text-pink-500">Duración</h3>
                        <p className="text-base font-semibold text-blue-900">{course.session_duration}h por sesión</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm">{course.summary}</p>
                </div>
                <img
                  className="aspect-[8/3] w-full object-cover object-left-top mt-4"
                  src={`/storage/images/course/${course.image}`}
                  alt=""
                  onError={e => e.target.src = `https://placehold.co/600x400?text=${course.name}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;