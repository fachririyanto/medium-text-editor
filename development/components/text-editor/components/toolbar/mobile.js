import React, { Component } from 'react'

/**
 * Button component.
 */
const Button = (props) => {
    let activeClass = props.isActive ? ' -is-active' : ''
    if (props.isDisabled) {
        activeClass = ' -is-disabled'
    }
    return (
        <button className={ "mobile__button" + activeClass } onClick={ props.onClick }>
            <i className="material-icons">{ props.icon }</i>
        </button>
    )
}

/**
 * Toolbar - mobile component.
 * @version 1.0.0
 */
export default class Mobile extends Component {

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
     * Validate if disabled inline mode.
     */
    isDisabledInline() {
        const { editor } = this.props
        const { value }  = editor
        let isDisabled = false

        if (value.fragment.text === '') {
            isDisabled = true
        }
        if (value.anchorBlock) {
            const allowinline = ['paragraph', 'h2', 'h3', 'blockquote', 'caption']
            if (allowinline.indexOf(value.anchorBlock.type) === -1) {
                isDisabled = true
            }
        } else {
            isDisabled = true
        }
        return isDisabled
    }

    /**
     * Validate if disabled block mode.
     */
    isDisabledBlock() {
        const { editor } = this.props
        const { value }  = editor
        let isDisabled = false

        if (value.anchorBlock) {
            if (value.anchorBlock.type === 'title') {
                isDisabled = true
            } else {
                const allowblock = ['paragraph', 'h2', 'h3', 'blockquote']
                if (allowblock.indexOf(value.anchorBlock.type) === -1) {
                    isDisabled = true
                }
            }
        } else {
            isDisabled = true
        }
        return isDisabled
    }

    /**
     * Validate if disabled void mode.
     */
    isDisabledVoid() {
        const { editor } = this.props
        const { value }  = editor
        let isDisabled = false

        if (value.anchorBlock) {
            if (value.anchorBlock.type === 'title') {
                isDisabled = true
            } else {
                if (value.anchorBlock.type === 'paragraph') {
                    if (value.anchorBlock.text !== '') {
                        isDisabled = true
                    }
                } else {
                    isDisabled = true
                }
            }
        } else {
            isDisabled = true
        }
        return isDisabled
    }

    /**
     * On click inline button.
     */
    onClickInline(event, type) {
        event.preventDefault()
        const { editor } = this.props
        editor.toggleMark(type).focus()
    }

    /**
     * On click link button.
     */
    onClickLink(event) {
        event.preventDefault()

        // if is active
        const isActive = this.hasInline('link')
        if (isActive) {
            const { editor } = this.props
            editor.unwrapInline('link').focus()
            return
        }

        // open prompt
        const href = window.prompt('Enter the URL of the link:')

        if (href === null) return
        const { editor } = this.props
        editor.wrapInline({
            type: 'link',
            data: {
                url: href
            }
        }).moveToEnd().focus()
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
        editor.setBlocks(isActive ? 'paragraph' : type).focus()
    }

    /**
     * Insert separator.
     */
    insertSeparator(event) {
        event.preventDefault()
        const { editor } = this.props

        // change block to separator
        editor.setBlocks('separator')
        editor.insertBlock('paragraph')
        editor.focus()
    }

    /**
     * Insert image.
     */
    insertImage(event) {
        event.preventDefault()

        // get target
        var target = event.target || window

        // if not selected file
        if (target.value.length === 0) return

        // get file
        const file = target.files[0]

        // init reader object
        var reader = new FileReader()

        // get base64 of image
        reader.onload = (e) => {
            // define editor object
            const { editor } = this.props

            // get image url
            const imageUrl = e.target.result

            // load image
            var image = new Image()
            image.src = imageUrl
            image.onload = function() {
                // insert image
                editor.setBlocks({
                    type: 'image',
                    data: {
                        url: imageUrl,
                        width: this.width,
                        height: this.height,
                        size: file.size,
                        align: 'default'
                    }
                })
                .insertBlock('caption')

                // set editor focus
                editor.focus()
            }
        }
        reader.readAsDataURL(file)
    }

    /**
     * On click image button.
     */
    onClickImage(event) {
        event.preventDefault()
        setTimeout(() => {
            document.getElementById('mobile__inputfile').click()
        }, 0)
    }

    /**
     * Render inline button.
     * @return {Element}
     */
    ButtonInline(type, icon) {
        const isActive = this.hasMark(type)
        const isDisabled = this.isDisabledInline()

        return (
            <Button
                isActive={ isActive }
                isDisabled={ isDisabled }
                icon={ icon }
                onClick={ event => isDisabled ? event.preventDefault() : this.onClickInline(event, type) }
            />
        )
    }

    /**
     * Render link button.
     * @return {Element}
     */
    ButtonLink(icon) {
        const isActive = this.hasInline('link')
        const isDisabled = this.isDisabledInline()
        return (
            <Button
                isActive={ isActive }
                isDisabled={ isDisabled }
                icon={ icon }
                onClick={ event => isDisabled ? event.preventDefault() : this.onClickLink(event) }
            />
        )
    }

    /**
     * Render block button.
     * @return {Element}
     */
    ButtonBlock(type, icon) {
        const isActive = this.hasBlock(type)
        const isDisabled = this.isDisabledBlock()
        return (
            <Button
                isActive={ isActive }
                isDisabled={ isDisabled }
                icon={ icon }
                onClick={ event => isDisabled ? event.preventDefault() : this.onClickBlock(event, type) }
            />
        )
    }

    /**
     * Render insert image button.
     * @return {Element}
     */
    ButtonImage(icon) {
        const isDisabled = this.isDisabledVoid()
        return (
            <Button
                isDisabled={ isDisabled }
                icon={ icon }
                onClick={ event => isDisabled ? event.preventDefault() : this.onClickImage(event) }
            />
        )
    }

    /**
     * Render insert separator button.
     * @return {Element}
     */
    ButtonSeparator(icon) {
        const isDisabled = this.isDisabledVoid()
        return (
            <Button
                isDisabled={ isDisabled }
                icon={ icon }
                onClick={ event => isDisabled ? event.preventDefault() : this.insertSeparator(event) }
            />
        )
    }

    /**
     * Render input file.
     * @return {Element}
     */
    InputFile() {
        return (
            <input
                id="mobile__inputfile"
                type="file"
                style={{ opacity: 0, width: 0, height: 0 }}
                accept="image/png, image/jpeg, image/gif, image/jpg"
                onChange={ event => this.insertImage(event) }
            />
        )
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        return (
            <div className="text-editor--toolbar-mobile" ref={ this.props.forwardedRef }>
                <div className="U--table -full-height -fixed">
                    <div className="table__cell">
                        { this.ButtonInline('bold', 'format_bold') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonInline('italic', 'format_italic') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonLink('insert_link') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonBlock('h3', 'title') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonBlock('blockquote', 'format_quote') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonImage('camera_alt') }
                    </div>
                    <div className="table__cell">
                        { this.ButtonSeparator('more_horiz') }
                    </div>
                </div>
                { this.InputFile() }
            </div>
        )
    }
}