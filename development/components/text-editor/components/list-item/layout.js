import React from 'react'

const ListItem = (props) => {
    const { attributes, children } = props
    return (
        <li className="list__item">
            <span className="block--container" { ...attributes }>
                <span className="block__transform">{ children }</span>
            </span>
        </li>
    )
}
export default ListItem