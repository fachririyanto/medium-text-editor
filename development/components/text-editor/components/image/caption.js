import React from 'react'

const Caption = (props) => {
    const { node, attributes, children, editor } = props

    // get value
    const { value } = editor

    // get previous block
    const prevBlock = value.document.getPreviousBlock(node.key)
    const data = {
        url: prevBlock.data.get('url'),
        width: prevBlock.data.get('width'),
        height: prevBlock.data.get('height'),
        align: prevBlock.data.get('align'),
        hasLink: prevBlock.data.get('hasLink') ? prevBlock.data.get('hasLink') : false,
        link: prevBlock.data.get('link') ? prevBlock.data.get('link') : ''
    }
    const ratio = (parseInt(data.height, 10) / parseInt(data.width, 10) * 100)

    // define aligns
    let align = data.align
    let isLeftAlign = false
    let mainWidth = 'auto'
    let marginLeft = 'auto'
    if (data.align === 'left') {
        isLeftAlign = true

        // validate image
        if (data.width <= 200) {
            mainWidth = data.width
            marginLeft = 0
        } else if (data.width <= 400) {
            mainWidth = data.width
            marginLeft = (parseInt(mainWidth) - 200) / 2
        } else {
            mainWidth = 400
            marginLeft = 140
        }
    } else {
        align = 'default'
    }
    return (
        <p className={ "block--default block--caption" + (props.node.text === '' ? ' -is-empty' : '') } style={{ marginBottom: isLeftAlign ? 0 : 48 }}>
            <span className={ "block--container" + (' -' + align) }  { ...attributes }>
                <span className="block__transform">
                    <span className="caption__text" style={{ marginLeft: isLeftAlign ? -marginLeft : marginLeft, width: mainWidth }}>
                        <span className="text__label">{ children }</span>
                        { props.node.text === '' ? (
                            <span className="caption__placeholder" contentEditable={ false }>
                                <span className="U--table -full-height">
                                    <span className="table__cell -vertical-align--middle U--text--center">
                                        Add your caption
                                    </span>
                                </span>
                            </span>
                        ) : '' }
                    </span>
                </span>
            </span>
        </p>
    )
}
export default Caption