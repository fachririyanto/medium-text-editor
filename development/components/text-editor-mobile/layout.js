/* import modules */
import React, { Component } from 'react'
import { Editor } from 'slate-react'

/**
 * Import schema.
 */
import schema from './schema'

/**
 * Import plugins.
 */
import HandleKeyDown from './plugins/handlekeydown'

/* List of plugins */
const plugins = [HandleKeyDown]

/**
 * Import components.
 */
import Title from './components/title/layout'
import Heading from './components/heading/layout'
import Paragraph from './components/paragraph/layout'
import Separator from './components/separator/layout'
import Blockquote from './components/blockquote/layout'
import Image from './components/image/layout'
import Caption from './components/image/caption'
import EmbedPost from './components/embed-post/layout'
import EmbedLink from './components/embed-link/layout'

import ToolbarMobile from './components/toolbar/mobile'

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
            isFocused: false
        }

        /**
         * Define text editor container ref.
         */
        this.texteditor = null

        /**
         * Define editor ref.
         */
        this.editor = null
    }

    /**
     * Set auto focus.
     */
    componentDidMount() {
        this.editor.focus()

        // set editor height
        // const element = document.querySelector('div[data-slate-editor="true"]')
        // element.style.height = '100px'
        // element.style.overflow = 'auto'
    }

    /**
     * Optimize rendering.
     */
    shouldComponentUpdate(nextProps, nextState) {
        if (!nextProps.value.anchorBlock) return false
        return true
    }

    /**
     * Change editor content.
     * @param {Value} value Editor value.
     */
    onChange({ value }) {
        this.props.onChange({ value }, () => {})
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        return (
            <>
                <div className="C--text-editor type--1 mobile--version" id={ this.props.id } ref={ node => this.texteditor = node }>
                    <div className="text-editor__content">
                        <ToolbarMobile
                            editor={ this.editor }
                            value={ this.props.value }
                        />
                        <Editor
                            id="texteditor"
                            ref={ editor => this.editor = editor }
                            autoFocus={ true }
                            value={ this.props.value }
                            onChange={ this.onChange.bind(this) }
                            renderNode={ this.renderNode.bind(this) }
                            renderMark={ this.renderMark.bind(this) }
                            schema={ schema }
                            spellCheck={ false }
                            plugins={ plugins }
                            placeholder={ this.props.placeholder }
                        />
                    </div>
                </div>
            </>
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
                    <a { ... attributes } href={ url }>
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
            default:
                return next()
        }
    }
}