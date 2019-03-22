import React from 'react'
import Block from './block'
import Inline from './inline'
import Image from './image'
import Video from './video'

/**
 * Toolbar component.
 * @version 1.0.0
 */
const Toolbar = (props) => {
    const { toolbar } = props

    // define default layout
    let layout = null
    let zIndex = 10

    // define toolbar
    switch (toolbar.name) {
        case 'add-block':
            // get layout
            layout = <Block { ...props } />
            break

        case 'add-inline':
            // get layout
            layout = <Inline { ...props } />
            zIndex = 100
            break

        case 'edit-image':
            // get layout
            layout = <Image { ...props } />
            zIndex = 100
            break
        
        case 'edit-embed-post':
            // get layout
            layout = <Video { ...props } />
            zIndex = 100
            break

        default:
            // default value
            layout = null
    }

    return (
        <div className="text-editor--toolbar" ref={ props.forwardedRef } style={{ zIndex: zIndex }}>
            { layout }
        </div>
    )
}
export default Toolbar