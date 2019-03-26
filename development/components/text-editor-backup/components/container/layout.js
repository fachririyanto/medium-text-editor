import React from 'react'

/**
 * Component for wrapping block.
 */
export default function Container(props) {
    return (
        <section className="block--open-container" { ...props.attributes }>
            <div className="block--container">
                { props.children }
            </div>
        </section>
    )
}