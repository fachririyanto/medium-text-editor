import Html from 'slate-html-serializer'
import { getEventTransfer } from 'slate-react'

/**
 * Define block tags.
 */
const BLOCK_TAGS = {
    p: 'paragraph',
    h1: 'h2',
    h2: 'h2',
    h3: 'h3',
    h4: 'h3',
    h5: 'h3',
    h6: 'h3',
    blockquote: 'blockquote',
    ul: 'bulleted-list',
    ol: 'numbered-list',
    li: 'list-item'
}

/**
 * Define mark tags.
 */
const MARK_TAGS = {
    strong: 'bold',
    em: 'italic',
    code: 'code'
}

/**
 * Define rules.
 */
const RULES = [
    {
        deserialize(el, next) {
            const block = BLOCK_TAGS[el.tagName.toLowerCase()]
            if (block) {
                return {
                    object: 'block',
                    type: block,
                    nodes: next(el.childNodes)
                }
            }
        },
    },
    {
        deserialize(el, next) {
            const mark = MARK_TAGS[el.tagName.toLowerCase()]
            if (mark) {
                return {
                    object: 'mark',
                    type: mark,
                    nodes: next(el.childNodes)
                }
            }
        },
    },
    {
        // Special case for code blocks, which need to grab the nested childNodes.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'pre') {
                const code = el.childNodes[0]
                const childNodes =
                    code && code.tagName.toLowerCase() === 'code'
                    ? code.childNodes
                    : el.childNodes

                return {
                    object: 'block',
                    type: 'code',
                    nodes: next(childNodes)
                }
            }
        }
    },
    {
        // Special case for images, to grab their src.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'img') {
                return {
                    object: 'block',
                    type: 'image',
                    nodes: next(el.childNodes),
                    data: {
                        src: el.getAttribute('src')
                    }
                }
            }
        },
    },
    {
        // Special case for links, to grab their href.
        deserialize(el, next) {
            if (el.tagName.toLowerCase() === 'a') {
                return {
                    object: 'inline',
                    type: 'link',
                    nodes: next(el.childNodes),
                    data: {
                        href: el.getAttribute('href')
                    }
                }
            }
        },
    }
]

/**
 * Create html serializer.
 */
const serializer = new Html({ rules: RULES })

export default {
    /**
     * On copy paste.
     */
    onPaste(event, editor, next) {
        const { value } = editor
        if (!value.anchorBlock) return next()

        switch (value.anchorBlock.type) {
            case 'blockcode': {
                event.preventDefault()
                const transfer = getEventTransfer(event)
                editor.insertText(transfer.text)
                break
            }
            default: return next()
        }
    }
}