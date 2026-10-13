import React from "react";
import CreateReactScript from "./Utils/CreateReactScript";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import Address from "./Components/Contact/Address";
import ContactForm from "./Components/Contact/ContactForm";

const Contact = ({generals}) => {
  return <>
    <Address generals={generals} />
    <ContactForm />
  </>
}

CreateReactScript((el, properties) => {
  createRoot(el).render(<Base {...properties}>
    <Contact {...properties} />
  </Base>);
})