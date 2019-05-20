import React from 'react'

/**
 * Image wrapper.
 */
export function ImageWrapper(props) {
    return (
        <div className={ "block--image-wrapper" + (props.isFocused ? ' -is-focused' : '') } { ...props.attributes }>
            { props.children }
        </div>
    )
}

/**
 * Image component.
 */
export default function Image(props) {
    const { node, attributes, isFocused } = props
    const data = {
        url: node.data.get('url'),
        width: node.data.get('width'),
        height: node.data.get('height'),
        align: node.data.get('align'),
        hasLink: node.data.get('hasLink') ? node.data.get('hasLink') : false,
        link: node.data.get('link') ? node.data.get('link') : ''
    }
    const ratio = (parseInt(data.height, 10) / parseInt(data.width, 10) * 100)

    // setup focus height
    let isLeftAlign = false
    let focusedHeight = 'auto'
    let focusedWidth = 'auto'
    let mainWidth = data.width
    let marginLeft = 'auto'
    if (data.align === 'left') {
        isLeftAlign = true

        // if image with less than 400
        if (data.width <= 400) {
            let widthRatio = parseInt(data.width, 10) / data.width
            focusedHeight = parseInt(data.height, 10) / widthRatio + 8
            mainWidth = data.width
            marginLeft = 140 - (400 - mainWidth)
        } else {
            let widthRatio = parseInt(data.width, 10) / 400
            focusedHeight = parseInt(data.height, 10) / widthRatio + 8
            mainWidth = 400
            marginLeft = 140
        }
        focusedWidth = mainWidth + 8
    }
    return (
        <figure className={ "block--default block--image" + (isFocused ? ' -is-selected' : '') } draggable={ false }>
            <div className={ "block--container -" + data.align } { ...attributes }>
                <div className="block__transform">
                    <div className="image__content" style={{ marginLeft: -marginLeft, width: data.width }}>
                        <div className="content__box">
                            <span className="content__container U--overlay-layout">
                                <img src={ data.url } alt={ data.url } draggable={ false } />
                            </span>
                            { data.hasLink ? (
                                <span className="content__link">
                                    <a target="_blank" href={ data.link }>{ data.link }</a>
                                </span>
                            ) : null }
                            <span className="content__ratio" style={{ paddingTop: `${ratio}%` }}></span>
                        </div>
                        <span className="image__focused U--overlay-layout" style={{ width: focusedWidth, height: focusedHeight }}></span>
                    </div>
                </div>
            </div>
        </figure>
    )
}