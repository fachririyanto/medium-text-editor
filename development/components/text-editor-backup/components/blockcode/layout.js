import React from 'react'

const Blockcode = (props) => (
    <pre className="block--default block--blockcode">
        <span className="block--container" { ...props.attributes }>
            <span className="block__transform">
                <code className="blockcode__content">
                    { props.children }
                </code>
            </span>
        </span>
    </pre>
)
export default Blockcode