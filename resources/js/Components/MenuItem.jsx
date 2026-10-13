import React from 'react'
import { Link } from '@inertiajs/react'

const MenuItem = ({ href, icon, children, onClick, target = '_self', rightBarToggle }) => {
  return (
    <li className={location.pathname.startsWith(href) ? 'menuitem-active' : ''}>
      {
        onClick ? (
          <a href='#' onClick={onClick} style={{ cursor: 'pointer' }}>
            <i className={icon}></i>
            <span> {children} </span>
          </a>
        ) : (
          <a href={href} target={target} className={`${location.pathname.startsWith(href) ? 'active' : ''} ${rightBarToggle ? 'right-bar-toggle' : ''}`} style={{ cursor: 'pointer' }}>
            <i className={icon}></i>
            <span> {children} </span>
          </a>
        )
      }
    </li>
  )
}

export default MenuItem