import React from "react";
import HtmlContent from "../../Utils/HtmlContent";

import historyImage from './images/history.png'
import em from "../../Utils/em";

const History = ({ title, history }) => {
  return (
    <section className="p-[5%] self-center w-full grid md:grid-cols-2 lg:grid-cols-5 gap-8 bg-white">
      <div className="lg:col-span-2">
        <img
          src={historyImage}
          className="flex relative grow max-md:mt-10 max-md:max-w-full"
          style={{ objectFit: "contain", aspectRatio: 1.324 }}
        />
      </div>
      <div className="lg:col-span-3">
        <h3 className="text-4xl not-italic font-bold leading-10 text-slate-600 max-md:max-w-full">
          {em(title)}
        </h3>
        <div className="flex flex-col mt-8 w-full text-xl leading-7 text-[color:var(--Woodsmoke-800,#2E405E)] max-md:max-w-full">
          {em(history)}
        </div>
      </div>
    </section>
  );
}

export default History