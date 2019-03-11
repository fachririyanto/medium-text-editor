import React, { Component } from 'react'

/**
 * Button block component.
 */
const Button = (props) => (
    <button className={ "inline__button" + (props.isActive ? ' -is-active' : '') } onMouseDown={ props.onClick }>
        <i className="material-icons">{ props.icon }</i>
    </button>
)

/**
 * Video toolbar component.
 * @version 1.0.0
 */
export default class Video extends Component {

    /**
     * When user click outside button.
     */
    handleClick(event) {
        event.preventDefault()
        const { editor } = this.props
        editor.focus()
    }

    /**
     * On click button.
     */
    onClickButton(event, align) {
        event.preventDefault()
        const { editor } = this.props
        const { value }  = editor
        const block      = value.anchorBlock

        // validate current align
        if (block.data.get('align') === align) return

        // get current block data
        const data = {
            url: block.data.get('url'),
            width: block.data.get('width'),
            height: block.data.get('height'),
            align: align
        }

        // update align
        editor.setNodeByKey(block.key, { data: data })

        // update next align
        const nextBlock = value.nextBlock
        editor.setNodeByKey(nextBlock.key, { data: {
            align: align
        }})
    }

    /**
     * Render button.
     * @return {Element}
     */
    Button(newAlign, icon) {
        const { editor } = this.props
        const { value }  = editor
        const block      = value.anchorBlock
        const align      = block ? block.data.get('align') : 'default'
        const isActive   = align === newAlign ? true : false
        return (
            <Button
                isActive={ isActive }
                icon={ icon }
                onClick={ event => this.onClickButton(event, newAlign) }
            />
        )
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        return (
            <div className="toolbar--inline" onClick={ this.handleClick.bind(this) }>
                <div className="inline__content">
                    { this.Button('default', 'view_day') }
                    { this.Button('left', 'format_indent_decrease') }
                    { this.Button('carousel', 'view_carousel') }
                    { this.Button('fullscreen', '4k') }
                </div>
            </div>
        )
    }
}