import React from 'react'

export const H2 = (props) => (
    <h2 className="block--default block--custom block--heading type--h2">
        <span className="block--container" { ...props.attributes }>
            <span className="block__transform">
                { props.children }
            </span>
        </span>
    </h2>
)

export const H3 = (props) => (
    <h2 className="block--default block--custom block--heading type--h3">
        <span className="block--container" { ...props.attributes }>
            <span className="block__transform">
                { props.children }
            </span>
        </span>
    </h2>
)

/**
 * Heading component container.
 */
const Heading = (props) => {
    switch (props.type) {
        case 'h2':
            return <H2 { ...props } />
        default:
            return <H3 { ...props } />
    }
}
export default Heading