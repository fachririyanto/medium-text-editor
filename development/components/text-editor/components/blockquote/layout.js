import React from 'react'

const Blockquote = (props) => (
    <blockquote className="block--default block--blockquote">
        <span className="block--container" { ...props.attributes }>
            <span className="block__transform">
                <span className="blockquote__content">
                    { props.children }
                </span>
            </span>
        </span>
    </blockquote>
)
export default Blockquote