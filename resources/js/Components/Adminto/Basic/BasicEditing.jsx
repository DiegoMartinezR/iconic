import React, { useState } from "react"
import ArrayDetails2Object from "../../../Utils/ArrayDetails2Object"
import em from "../../../Utils/em"
import WebDetailsRest from "../../../Actions/Admin/WebDetailsRest"

const webDetailsRest = new WebDetailsRest()

const BasicEditing = ({details: detailsDB = [], correlative}) => {
  const [details, setDetails] = useState(ArrayDetails2Object(detailsDB))
  const [titleEditing, setTitleEditing] = useState(false)
  const [descriptionEditing, setDescriptionEditing] = useState(false)

  const onTitleChange = async (e) => {
    const result = webDetailsRest.save({
      page: correlative,
      name: 'title',
      description: e.target.value
    })
    if (!result) return
    setDetails(old => ({ ...old, [`${correlative}.title`]: e.target.value }))
    setTitleEditing(false)
  }

  const onDescriptionChange = async (e) => {
    const result = webDetailsRest.save({
      page: correlative,
      name: 'description',
      description: e.target.value
    })
    if (!result) return
    setDetails(old => ({ ...old, [`${correlative}.description`]: e.target.value }))
    setDescriptionEditing(false)
  }

  return <>
      {
        titleEditing
          ? <input className='form-control form-control-sm mb-1' defaultValue={details?.[`${correlative}.title`]} onBlur={onTitleChange} autoFocus />
          : <h4 className='header-title mb-1' onClick={() => setTitleEditing(true)}>{em(details?.[`${correlative}.title`] || 'Sin título')}</h4>
      }
      {
        descriptionEditing
          ? <textarea className='form-control form-control-sm' defaultValue={details?.[`${correlative}.description`]} style={{ minHeight: 27, fieldSizing: 'content' }} onBlur={onDescriptionChange} autoFocus />
          : <small className='text-muted' onClick={() => setDescriptionEditing(true)}>{em(details?.[`${correlative}.description`] || 'Sin descripción')}</small>
      }
  </>
}

export default BasicEditing