/* import modules */
import React, { Component } from 'react'
import { Editor } from 'slate-react'
import { KeyUtils } from 'slate'
import { isKeyHotkey } from 'is-hotkey'

/**
 * Import plugins.
 */
import HandleKeydown from './plugins/handle-keydown'
import HandleCopyPaste from './plugins/handle-copypaste'

/* List of plugins */
const plugins = [HandleKeydown, HandleCopyPaste]

/**
 * Import schema.
 */
import schema from './schema'

/**
 * Import global variables.
 */
import {
    ELEMENT_DEFAULT_RANGE,
    TOOLBAR_DEFAULT_STATE
} from './core/variable'

/**
 * Import core editor.
 */
import { initToolbar } from './core/editor'
import { isPlaceholderState } from './core/validation'

/**
 * Import components.
 */
import Toolbar from './components/toolbar/layout'
import Title from './components/title/layout'
import Heading from './components/heading/layout'
import Paragraph from './components/paragraph/layout'
import Separator from './components/separator/layout'
import Blockquote from './components/blockquote/layout'
import Blockcode from './components/blockcode/layout'
import Image, { ImageWrapper } from './components/image/layout'
import Caption from './components/image/caption'
import EmbedPost from './components/embed-post/layout'
import EmbedLink from './components/embed-link/simple'
import BulletedList from './components/bulleted-list/layout'
import NumberedList from './components/numbered-list/layout'
import ListItem from './components/list-item/layout'

/**
 * Reset key for Server Side Rendering purpose.
 */
KeyUtils.resetGenerator()

/**
 * Define hotkey matchers.
 * @type {Function}
 */
const isKeyHotLink = isKeyHotkey('mod+k')

/**
 * Placeholder component.
 */
const TextPlaceholder = (props) => (
    <div className="text-editor--placeholder">
        <span className="placeholder__container">
            <span className="placeholder__text">{ props.label }</span>
        </span>
    </div>
)

/**
 * Text editor component.
 * @version 1.0.0
 */
export default class TextEditor extends Component {

    constructor(props) {
        super(props)

        /**
         * Initial state.
         */
        this.state = {
            toolbar: TOOLBAR_DEFAULT_STATE
        }

        /**
         * Define text editor container ref.
         */
        this.texteditor = null

        /**
         * Define editor ref.
         */
        this.editor = null

        /**
         * Define toolbar object.
         */
        this.toolbar = TOOLBAR_DEFAULT_STATE
    }

    /**
     * Add event listener.
     */
    componentDidMount() {
        this.editor.focus()
        document.addEventListener('mousedown', this.handleClickOutside.bind(this))
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside.bind(this))
    }

    /**
     * Optimize rendering.
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.value.anchorBlock && this.toolbar.name === 'add-inline') return false
        return true
    }

    /**
     * Handle click outside editor.
     */
    handleClickOutside(event) {
        if (this.texteditor && !this.texteditor.contains(event.target)) {
            const toolbar = ['add-inline', 'edit-image', 'edit-embed-post']
            if (toolbar.indexOf(this.toolbar.name) > -1) {
                this.toolbar = {
                    ref: this.toolbar.ref,
                    range: ELEMENT_DEFAULT_RANGE,
                    name: '',
                    blockKey: '',
                    blockType: '',
                    state: {}
                }
            }
            this.setState({
                toolbar: this.toolbar
            }, () => {
                this.editor.deselect()
            })
        }
    }

    /**
     * Init toolbar.
     */
    initToolbar(value) {
        if (value.anchorBlock) {
            // if block code
            if (value.anchorBlock.type === 'blockcode') {
                this.toolbar = {
                    ref: this.toolbar.ref,
                    range: ELEMENT_DEFAULT_RANGE,
                    name: '',
                    blockKey: '',
                    blockType: '',
                    state: {}
                }
                this.props.onChange({ value }, () => {
                    initToolbar(this, value)
                })
                return
            }

            // title conditional state
            if (value.anchorBlock.type === 'title') {
                this.toolbar = {
                    ref: this.toolbar.ref,
                    range: this.toolbar.range,
                    name: 'add-block',
                    blockKey: value.anchorBlock.key,
                    blockType: value.anchorBlock.type,
                    state: {
                        isOpen: false,
                        showInputLink: this.toolbar.showInputLink ? this.toolbar.showInputLink : false
                    }
                }
                this.props.onChange({ value }, () => {
                    initToolbar(this, value)
                })
            } else if (value.anchorBlock.type === 'embed-post') {
                // add edit video conditional state
                this.toolbar = {
                    ref: this.toolbar.ref,
                    range: this.toolbar.range,
                    name: 'edit-embed-post',
                    blockKey: value.anchorBlock.key,
                    blockType: value.anchorBlock.type,
                    state: {}
                }
                this.props.onChange({ value }, () => {
                    initToolbar(this, value)
                })
            } else if (value.anchorBlock.type === 'image') {
                // add edit image conditional state
                this.toolbar = {
                    ref: this.toolbar.ref,
                    range: this.toolbar.range,
                    name: 'edit-image',
                    blockKey: value.anchorBlock.key,
                    blockType: value.anchorBlock.type,
                    state: {}
                }
                this.props.onChange({ value }, () => {
                    initToolbar(this, value)
                })
            } else {
                // add block conditional state
                if (value.anchorBlock.type === 'paragraph' && value.anchorBlock.text === '') {
                    this.toolbar = {
                        ref: this.toolbar.ref,
                        range: this.toolbar.range,
                        name: 'add-block',
                        blockKey: value.anchorBlock.key,
                        blockType: value.anchorBlock.type,
                        state: {
                            isOpen: false,
                            showInputLink: this.toolbar.showInputLink ? this.toolbar.showInputLink : false
                        }
                    }
                    this.props.onChange({ value }, () => {
                        initToolbar(this, value)
                    })
                } else {
                    // add inline conditional state
                    if (value.fragment.text !== '') {
                        this.toolbar = {
                            ref: this.toolbar.ref,
                            range: this.toolbar.range,
                            name: 'add-inline',
                            blockKey: value.anchorBlock.key,
                            blockType: value.anchorBlock.type,
                            state: this.toolbar.state
                        }
                        this.props.onChange({ value }, () => {
                            initToolbar(this, value)
                        })
                        return
                    }

                    // default state
                    if (this.state.toolbar.type !== '') {
                        this.toolbar = {
                            ref: this.toolbar.ref,
                            range: ELEMENT_DEFAULT_RANGE,
                            name: '',
                            blockKey: '',
                            blockType: '',
                            state: {}
                        }
                        this.props.onChange({ value }, () => {
                            initToolbar(this, value)
                        })
                    }
                }
            }
        } else {
            this.props.onChange({ value }, () => {})
        }
    }

    /**
     * Update toolbar range.
     */
    setToolbarRange(range) {
        this.toolbar.range = range
    }

    /**
     * Update toolbar value.
     * @param {Object} value
     */
    setToolbar(value, callback) {
        this.toolbar = value
        this.setState({
            toolbar: value
        }, () => callback())
    }

    /**
     * Change editor content.
     * @param {Value} value Editor value.
     */
    onChange({ value }) {
        this.initToolbar(value)
    }

    /**
     * Handle on keydown.
     */
    onKeyDown(event, editor, next) {
        if (isKeyHotLink(event)) {
            const { value } = editor
            const { selection } = value

            // validate block
            if (!value.anchorBlock) return next()

            // validate block type
            const allowed = ['paragraph', 'caption', 'list-item']
            if (allowed.indexOf(value.anchorBlock.type) === -1) return next()

            // if toolbar is open
            if (selection.isExpanded && this.toolbar.name === 'add-inline') {
                if (this.toolbar.state.showInputLink) return next()
                let currentState = this.toolbar
                currentState.state.showInputLink = true
                this.setToolbar(currentState, () => {
                    setTimeout(() => {
                        document.getElementById('inline__textbox').focus()
                    }, 0)
                })
                return true
            }
        }
        return next()
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        return (
            <div className="C--text-editor type--1" id={ this.props.id } ref={ node => this.texteditor = node }>
                { isPlaceholderState(this.props.value) ? <TextPlaceholder label="Title" /> : null }
                <Toolbar
                    forwardedRef={ node => this.toolbar.ref = node }
                    editor={ this.editor }
                    value={ this.props.value }
                    toolbar={ this.toolbar }
                    setToolbar={ this.setToolbar.bind(this) }
                    setToolbarRange= { this.setToolbarRange.bind(this) }
                />
                <div className="text-editor__content">
                    <Editor
                        ref={ editor => this.editor = editor }
                        autoFocus={ true }
                        value={ this.props.value }
                        onChange={ this.onChange.bind(this) }
                        onKeyDown={ this.onKeyDown.bind(this) }
                        renderNode={ this.renderNode.bind(this) }
                        renderMark={ this.renderMark.bind(this) }
                        schema={ schema }
                        spellCheck={ false }
                        plugins={ plugins }
                        placeholder={ this.props.placeholder }
                    />
                </div>
            </div>
        )
    }

    /**
     * Render custom block nodes.
     * @return {Element}
     */
    renderNode(props, editor, next) {
        const { node, children, attributes } = props

        // define node
        switch (node.type) {
            case 'title':
                return (
                    <Title placeholder={ this.props.placeholder } { ...props } />
                )
            case 'h2':
                return (
                    <Heading type="h2" { ...props } />
                )
            case 'h3':
                return (
                    <Heading type="h3" { ...props } />
                )
            case 'blockquote':
                return (
                    <Blockquote { ...props } />
                )
            case 'blockcode':
                return (
                    <Blockcode { ...props } />
                )
            case 'image-wrapper':
                return (
                    <ImageWrapper { ...props } />
                )
            case 'image':
                return (
                    <Image { ...props } />
                )
            case 'caption':
                return (
                    <Caption { ...props } />
                )
            case 'separator':
                return (
                    <Separator { ...props } />
                )
            case 'link':
                const { data } = node
                const url = data.get('url')
                return (
                    <a { ...attributes } href={ url }>
                        { children }
                    </a>
                )
            case 'embed-link':
                return (
                    <EmbedLink { ...props } />
                )
            case 'embed-post':
                return (
                    <EmbedPost { ...props } />
                )
            case 'bulleted-list':
                return (
                    <BulletedList { ...props } />
                )
            case 'numbered-list':
                return (
                    <NumberedList { ...props } />
                )
            case 'list-item':
                return (
                    <ListItem { ...props } />
                )
            case 'break':
                return <br />
            case 'paragraph':
                return (
                    <Paragraph { ...props } />
                )
            default:
                return next()
        }
    }

    /**
     * Render mark.
     * @return {Element}
     */
    renderMark(props, editor, next) {
        const { children, mark, attributes } = props

        switch (mark.type) {
            case 'bold':
                return <strong { ...attributes }>{ children }</strong>
            case 'italic':
                return <em { ...attributes }>{ children }</em>
            case 'code':
                return <code { ...attributes }>{ children }</code>
            default:
                return next()
        }
    }
}