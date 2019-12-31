import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const BottomButton = ({text, colorClass, icon, onClick}) => {
    return (
        <button type={"button"} className={`btn btn-block no-border ${colorClass}`}
        onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} size={"lg"}/> {text}
        </button>
    )
}
BottomButton.propTypes = {
    text: PropTypes.string,
    colorClass:  PropTypes.string,
    icon: PropTypes.element.isRequired,
    onClick: PropTypes.func
}
