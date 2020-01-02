import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import './tab-list.less'
export const TabList = ({files, activeId, unsavedIds, onTabClick, onCloseTab}) => {
  return (
      <ul className={"nav nav-pills tab-list"}>
          {files.map(file =>{
              const withUnsaveMark = unsavedIds.includes(file.id)
              const fclassname = classNames({
                  'nav-link ': true,
                  active: file.id === activeId,
                  withUnsaved: withUnsaveMark
              })

             return  (
                 <li className={"nav-item"} key={file.id}>
                     <span  className={fclassname} onClick={(e) => {e.preventDefault(); onTabClick(file.id)}}>
                         {file.title}
                         <span className={"ml-2 close-icon"} onClick={e => {e.preventDefault();e.stopPropagation(); onCloseTab(file.id)}}>
                             <FontAwesomeIcon icon={faTimes}/>
                         </span>
                         {
                             withUnsaveMark ? (
                                 <span className={"rounded-circle ml-2 unsaved-icon"}></span>) : null
                         }
                     </span>
                 </li>
             )
          })}

      </ul>
  )
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unsavedIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func
}

TabList.defaultProps = {
    unsavedIds: []
}