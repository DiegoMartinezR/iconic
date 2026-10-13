import React from 'react';
import CreateReactScript from './Utils/CreateReactScript';
import { createRoot } from 'react-dom/client';
import Base from './Components/Tailwind/Base';
import AboutHeader from './Components/About/AboutHeader';
import Testimonies from './Components/Home/Testimonies';
import History from './Components/About/History';
import Strengths from './Components/About/Strengths';
import ArrayDetails2Object from './Utils/ArrayDetails2Object';
import Weare from './Components/Home/Weare';

const About = ({ testimonies, summary, aboutus, strengths, details: detailsDB }) => {
  const aboutTrasciendeTitle = aboutus.find(x => x.correlative == 'about-trasciende-title')?.description ?? '';
  const aboutTrasciendeDescription = aboutus.find(x => x.correlative == 'about-trasciende-description')?.description ?? '';
  const aboutKaori = aboutus.find(x => x.correlative == 'about-kaori')?.description ?? '';
  const details = ArrayDetails2Object(detailsDB);

  return <>
    {
      details['about.video'] &&
      <AboutHeader summary={summary} details={details} />
    }
    <History title={aboutTrasciendeTitle} history={aboutTrasciendeDescription} />
    <Weare info={aboutKaori} isAbout={true} />
    <Testimonies testimonies={testimonies} background='gray-100' details={details} />
    <Strengths strengths={strengths} details={details} />
  </>
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base {...properties}>
    <About {...properties} />
  </Base>);
})