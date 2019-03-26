import React from 'react'

const Paragraph = (props) => (
    <p className="block--default block--paragraph">
        <span className="block--container" { ...props.attributes }>
            <span className="block__transform">
                { props.children }
            </span>
        </span>
    </p>
)
export default Paragraph