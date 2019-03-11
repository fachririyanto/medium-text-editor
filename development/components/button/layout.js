import React from 'react'
import { printClass } from '../../helpers/utils'

const Button = (props) => (
    <button className={ "button" + printClass(props.className) } onClick={ props.onClick }>
        { props.children }
    </button>
)
export default Button