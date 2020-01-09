import React from 'react'
import './loader.less'

export const  Loader = ({text = '加载中'}) => (
    <div className={"loading-component text-center"}>
        <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">{text}</span>
        </div>
        <h5 className={"text-primary"}>{text}</h5>
    </div>
)