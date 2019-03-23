import React, { Component } from 'react'

/**
 * Button inline component.
 */
const ButtonInline = (props) => (
    <button className={ "inline__button" + (props.isActive ? ' -is-active' : '') } onClick={ props.onClick }>
        <i className="material-icons">{ props.icon }</i>
    </button>
)

/**
 * Button link component.
 */
const ButtonLink = (props) => (
    <button className={ "inline__button" + (props.isActive ? ' -is-active' : '') } onClick={ props.onClick }>
        <i className="material-icons">insert_link</i>
    </button>
)

/**
 * Button block component.
 */
const ButtonBlock = (props) => (
    <button className={ "inline__button" + (props.isActive ? ' -is-active' : '') } onClick={ props.onClick }>
        <i className="material-icons">{ props.icon }</i>
    </button>
)

/**
 * Toolbar - inline component.
 * @version 1.0.0
 */
export default class Inline extends Component {

    /**
     * Validate if content already has title block.
     */
    hasTitle() {
        const { editor } = this.props
        const { value }  = editor
        let hasTitle = 0
        value.document.nodes.map((node) => {
            if (node.type === 'title') hasTitle += 1
        })
        return hasTitle
    }

    /**
     * Validate if has mark.
     */
    hasMark(type) {
        const { editor } = this.props
        const { value }  = editor
        return value.activeMarks.some(mark => mark.type == type)
    }

    /**
     * Validate if has block.
     */
    hasBlock(type) {
        const { editor } = this.props
        const { value }  = editor
        if (type === 'title') {
            if (this.hasTitle()) {
                type = 'h2'
            }
        }
        return value.blocks.some(node => node.type == type)
    }

    /**
     * Validate if has inline.
     */
    hasInline(type) {
        const { editor } = this.props
        const { value }  = editor
        return value.inlines.some(inline => inline.type === type)
    }

    /**
     * When user click outside button.
     */
    handleClick(event) {
        event.preventDefault()
        const { editor } = this.props
        const { toolbar } = this.props

        if (toolbar.state.showInputLink) {
            setTimeout(() => {
                document.getElementById('inline__textbox').focus()
            }, 0)
        } else {
            editor.focus()
        }
    }

    /**
     * On click inline button.
     */
    onClickInline(event, type) {
        event.preventDefault()
        const { editor } = this.props
        editor.toggleMark(type)
    }

    /**
     * On click block button.
     */
    onClickBlock(event, type) {
        event.preventDefault()
        const { editor } = this.props

        if (type === 'title') {
            if (this.hasTitle()) {
                type = 'h2'
            }
        }
        const isActive = this.hasBlock(type)
        editor.setBlocks(isActive ? 'paragraph' : type)
    }

    /**
     * On click link button.
     */
    onClickLink(event) {
        event.preventDefault()
        const isActive = this.hasInline('link')

        if (isActive) {
            const { editor } = this.props
            editor.unwrapInline('link').focus()
        } else {
            let currentState = this.props.toolbar
            currentState.state.showInputLink = true
            this.props.setToolbar(currentState, () => {
                setTimeout(() => {
                    document.getElementById('inline__textbox').focus()
                }, 0)
            })
        }
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
            const value = target.value

            // validate value
            if (value && value !== '') {
                const { editor } = this.props
                editor.wrapInline({
                    type: 'link',
                    data: {
                        url: value
                    }
                }).moveToEnd().focus()
            }
        }
    }

    /**
     * Render inline button.
     * @return {Element}
     */
    ButtonInline(type, icon) {
        const isActive = this.hasMark(type)
        return (
            <ButtonInline
                isActive={ isActive }
                icon={ icon }
                onClick={ event => this.onClickInline(event, type) }
            />
        )
    }

    /**
     * Render link button.
     * @return {Element}
     */
    ButtonLink() {
        const isActive = this.hasInline('link')
        return (
            <ButtonLink
                isActive={ isActive }
                onClick={ event => this.onClickLink(event) }
            />
        )
    }

    /**
     * Render block button.
     * @return {Element}
     */
    ButtonBlock(type, icon) {
        const isActive = this.hasBlock(type)
        return (
            <ButtonBlock
                isActive={ isActive }
                icon={ icon }
                onClick={ event => this.onClickBlock(event, type) }
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
     * Render divider/separator.
     * @return {Element}
     */
    Divider() {
        return (
            <span className="inline__divider"></span>
        )
    }

    /**
     * Render for paragraph.
     */
    Paragraph() {
        return (
            <div className="toolbar--inline" onClick={ this.handleClick.bind(this) }>
                <div className="inline__content">
                    { this.ButtonInline('bold', 'format_bold') }
                    { this.ButtonInline('italic', 'format_italic') }
                    { this.ButtonLink() }
                    { this.Divider() }
                    { this.ButtonBlock('title', 'title') }
                    { this.ButtonBlock('h3', 'text_fields') }
                    { this.ButtonBlock('blockquote', 'format_quote') }
                    { this.props.toolbar.state.showInputLink ? this.InputLink() : null }
                </div>
            </div>
        )
    }

    /**
     * Render for caption.
     */
    Caption() {
        const isInputOpen = this.props.toolbar.state.showInputLink
        return (
            <div className={ "toolbar--inline" + (isInputOpen ? ' -is-input-open' : '') } onClick={ this.handleClick.bind(this) }>
                <div className="inline__content">
                    { this.ButtonInline('bold', 'format_bold') }
                    { this.ButtonInline('italic', 'format_italic') }
                    { this.ButtonLink() }
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

        // validate value
        if (!value.anchorBlock) return null

        // define block
        switch (value.anchorBlock.type) {
            case 'list-item':
            case 'caption':
                return this.Caption()
            default:
                return this.Paragraph()
        }
    }
}