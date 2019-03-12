import React from 'react'

const Caption = (props) => {
    const { node, attributes, children, editor } = props

    // get value
    const { value } = editor

    // get previous block
    const prevBlock = value.document.getPreviousBlock(node.key)
    let align = prevBlock.data.get('align')

    // define aligns
    if (align !== 'left') {
        align = 'default'
    }
    return (
        <p className="block--default block--caption">
            <span className={ "block--container" + (' -' + align) }  { ...attributes }>
                <span className="block__transform">
                    <span className="caption__text">
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