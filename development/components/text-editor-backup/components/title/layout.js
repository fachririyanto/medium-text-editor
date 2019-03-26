import React from 'react'

const Title = (props) => {
    const { node, attributes, children, editor } = props
    const { value } = editor
    const previousBlock = value.document.getPreviousBlock(node.key)
    return (
        <h1 className={ "block--default block--title" + (previousBlock ? '' : ' -first-child') }>
            <span className="block--container" { ...attributes }>
                <span className="block__transform">
                    <span className="title__text">{ children }</span>
                </span>
            </span>
        </h1>
    )
}
export default Title