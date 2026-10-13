import React from 'react'
import { createRoot } from 'react-dom/client'
import '../../css/repository.css'
import RepositoryDropzone from '../Reutilizables/Repository/RepositoryDropzone.jsx'
import CreateReactScript from '../Utils/CreateReactScript.jsx'
import Base from '../Components/Adminto/Base.jsx'

const Repository = ({ files: filesDB }) => {
  return (
    <>
      <div className='repository-container'>
        <RepositoryDropzone files={filesDB} />
      </div>
    </>
  )
};

CreateReactScript((el, properties) => {
  createRoot(el).render(
    <Base {...properties} title='Repositorio'>
      <Repository {...properties} />
    </Base>
  );
})