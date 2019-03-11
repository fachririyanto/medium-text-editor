import React from 'react'
import { printClass } from '../../helpers/utils'

const Card = (props) => (
    <div className={ "card" + printClass(props.className) }>
        { props.children }
    </div>
)
export default Card