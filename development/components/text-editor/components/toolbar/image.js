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
            align: align,
            hasLink: block.data.get('hasLink') ? block.data.get('hasLink') : false,
            link: block.data.get('link') ? block.data.get('link') : ''
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
     * On close link.
     */
    onCloseLink(event) {
        event.preventDefault()
        let currentState = this.props.toolbar
        currentState.state.showInputLink = false
        this.props.setToolbar(currentState, () => {
            const { editor } = this.props
            editor.focus()
        })
    }

    /**
     * On confirm link. 
     */
    onConfirmLink(event) {
        if (event.which === 13) {
            event.preventDefault()

            // define target
            const target = event.target || window

            // define input value
            const input = target.value

            // validate value
            if (input && input !== '') {
                let currentState = this.props.toolbar
                currentState.state.showInputLink = false
                this.props.setToolbar(currentState, () => {
                    const { editor } = this.props
                    const { value }  = editor
                    const block      = value.anchorBlock
                    const data       = {
                        url: block.data.get('url'),
                        width: block.data.get('width'),
                        height: block.data.get('height'),
                        align: block.data.get('align'),
                        hasLink: true,
                        link: input
                    }
                    editor.setNodeByKey(block.key, { data: data }).focus()
                })
            }
        }
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
     * Render input link.
     * @return {Element}
     */
    InputLink() {
        return (
            <div className="inline__input-link U--overlay-layout">
                <div className="link__component">
                    <input
                        id="inline__textbox"
                        type="text"
                        className="link__textbox"
                        placeholder="Paste or type a link..."
                        autoFocus={ true }
                        onKeyDown={ this.onConfirmLink.bind(this) }
                    />
                    <button className="button--hide-link link__close" onClick={ this.onCloseLink.bind(this) }>
                        <span className="U--table -full-height">
                            <span className="table__cell -vertical-align--middle">
                                <i className="material-icons">close</i>
                            </span>
                        </span>
                    </button>
                </div>
            </div>
        )
    }

    /**
     * Render for small image.
     */
    Small() {
        const isInputOpen = this.props.toolbar.state.showInputLink
        return (
            <div className="toolbar--inline" onClick={ this.handleClick.bind(this) }>
                <div className="inline__content">
                    { this.Button('default', 'view_day') }
                    { this.Button('left', 'format_indent_decrease') }
                    { isInputOpen ? this.InputLink() : null }
                </div>
            </div>
        )
    }

    /**
     * Render for big image.
     */
    Big() {
        const isInputOpen = this.props.toolbar.state.showInputLink
        return (
            <div className="toolbar--inline" onClick={ this.handleClick.bind(this) }>
                <div className="inline__content">
                    { this.Button('default', 'view_day') }
                    { this.Button('left', 'format_indent_decrease') }
                    { this.Button('carousel', 'view_carousel') }
                    { this.Button('fullscreen', '4k') }
                    { isInputOpen ? this.InputLink() : null }
                </div>
            </div>
        )
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        const { editor } = this.props
        const { value }  = editor
        const block      = value.anchorBlock
        const width      = block.data.get('width')
        return width <= 680 ? this.Small() : this.Big()
    }
}