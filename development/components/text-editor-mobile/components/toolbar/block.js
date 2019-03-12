import React, { Component } from 'react'

/**
 * Toolbar - block component.
 * @version 1.0.0
 */
export default class Block extends Component {

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
     * Toggle button.
     */
    toggleButton(event) {
        event.preventDefault()
        let currentState = this.props.toolbar
        this.props.setToolbar({
            name: 'add-block',
            blockKey: currentState.blockKey,
            blockType: currentState.blockType,
            state: {
                isOpen: !currentState.state.isOpen,
                showInputLink: false
            }
        }, () => {
            if (currentState.state.isOpen) {
                const { editor } = this.props
                editor.focus()
            }
        })
    }

    /**
     * On click image button.
     */
    onClickImage(event) {
        event.preventDefault()
        setTimeout(() => {
            document.getElementById('block__inputfile').click()
        }, 0)
    }

    /**
     * On click video button.
     */
    onClickVideo(event) {
        event.preventDefault()

        let currentState = this.props.toolbar
        currentState.state.showInputLink = true
        this.props.setToolbar(currentState, () => {
            setTimeout(() => {
                document.getElementById('block__textbox').focus()
            }, 0)
        })
    }

    /**
     * On change video link.
     */
    onChangeVideoLink(event) {
        const value = event.target.value

        if (value && value.length > 0) {
            const { editor } = this.props
            editor.setBlocks('paragraph')
            editor.insertText(value)
            editor.focus()
        }
    }

    /**
     * Render input link.
     * @return {Element}
     */
    InputLink() {
        return (
            <div className="block__input-link U--overlay-layout">
                <input
                    type="text"
                    id="block__textbox"
                    className="link__textbox"
                    placeholder="Paste Youtube video URL..."
                    autoFocus={ true }
                    onChange={ this.onChangeVideoLink.bind(this) }
                />
            </div>
        )
    }

    /**
     * Render input file.
     * @return {Element}
     */
    InputFile() {
        return (
            <input
                id="block__inputfile"
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
        const { toolbar } = this.props
        const isTitle = toolbar.blockType === 'title' ? true : false
        return (
            <div className={ "toolbar--block" + (isTitle ? ' -is-title' : ' -is-default') }>
                { isTitle ? (
                    <label className="block__label">
                        Title
                    </label>
                ) : (
                    <>
                        <button className={ "button--open-toolbar block__button" + (toolbar.state.isOpen ? ' -rotate' : '') } onClick={ this.toggleButton.bind(this) }>
                            <i className="material-icons">add</i>
                        </button>
                        { toolbar.state.isOpen ? (
                            <div className="block__button-list">
                                <button className="block__button" onClick={ this.onClickImage.bind(this) }>
                                    <i className="material-icons">camera_alt</i>
                                </button>
                                <button className="block__button" onClick={ this.onClickVideo.bind(this) }>
                                    <i className="material-icons">play_arrow</i>
                                </button>
                                <button className="block__button" onClick={ this.insertSeparator.bind(this) }>
                                    <i className="material-icons">more_horiz</i>
                                </button>
                            </div>
                        ) : null }
                        { toolbar.state.showInputLink ? this.InputLink() : null }
                        { this.InputFile() }
                    </>
                )}
            </div>
        )
    }
}