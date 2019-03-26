import React from 'react'

const NumberedList = (props) => {
    const { attributes, children } = props
    return (
        <div className={ "block--default block--list" }>
            <span className="block--container" { ...attributes }>
                <ol className="block__transform">{ children }</ol>
            </span>
        </div>
    )
}
export default NumberedList