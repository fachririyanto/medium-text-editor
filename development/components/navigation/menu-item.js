import React from 'react'

const MenuItem = (props) => (
    <li className="menu__item">
        <a href={ "/" + props.menu.id }>
            { props.menu.name }
        </a>
    </li>
)
export default MenuItem