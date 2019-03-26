import React from 'react'

const BulletedList = (props) => {
    const { attributes, children } = props
    return (
        <div className={ "block--default block--list" }>
            <span className="block--container" { ...attributes }>
                <ul className="block__transform">{ children }</ul>
            </span>
        </div>
    )
}
export default BulletedList