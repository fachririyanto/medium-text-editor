import { isKeyHotkey } from 'is-hotkey'
import isUrl from 'is-url'
import { isYoutubeVideo } from '../../../helpers/validation'
import { getYoutubeID } from '../../../helpers/utils'
import { hasTitle, hasMark, hasBlock } from '../core/validation'
import { findNode, findDOMNode } from 'slate-react'

/**
 * Define hotkey matchers.
 * @type {Function}
 */
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUndoHotkey = isKeyHotkey('mod+z')
const isBreakLineKey = isKeyHotkey('Shift+Enter')
const isSeparatorKey = isKeyHotkey('mod+Enter')
const isModAltKey = isKeyHotkey('mod+alt')

/**
 * Define block type by char.
 */
const getType = (char) => {
    switch (char) {
        case '*':
        case '1.':
            return 'list-item'
        default:
            return null
    }
}

export default {
    /**
     * On Keydown.
     */
    onKeyDown(event, editor, next) {
        const { value } = editor

        /**
         * Create new line but not create new paragraph.
         */
        if (isBreakLineKey(event)) {
            if (!value.anchorBlock) return next()
            if (value.anchorBlock.type === 'paragraph') {
                editor.insertInline({
                    type: 'break',
                    data: {}
                }).moveToStartOfNextText().focus()
                return true
            }
            return next()
        }

        /**
         * Insert separator.
         */
        if (isSeparatorKey(event)) {
            event.preventDefault()

            if (!value.anchorBlock) return next()
            if (value.anchorBlock.type === 'paragraph') {
                if (value.anchorBlock.text === '') {
                    editor.setBlocks('separator')
                } else {
                    editor.insertBlock('separator')
                }
            } else {
                editor.insertBlock('separator')
            }
            editor.insertBlock('paragraph')
            editor.focus()
            return true
        }

        /**
         * Add blockquote.
         */
        if (isModAltKey(event)) {
            event.preventDefault()

            // validate block
            if (!value.anchorBlock) return next()

            // validate allowed block
            const allowed = ['paragraph', 'blockquote', 'h2', 'h3']
            if (allowed.indexOf(value.anchorBlock.type) === -1) return next()

            // define type
            let type
            switch (event.keyCode) {
                case 49: {
                    type = 'title'
                    if (hasTitle(value)) {
                        type = 'h2'
                    }
                    break
                }
                case 50: {
                    type = 'h3'
                    break
                }
                case 53: {
                    type = 'blockquote'
                    break
                }
                default: return next()
            }
            const isActive = hasBlock(value, type)
            editor.setBlocks(isActive ? 'paragraph' : type)
            return true
        }

        /**
         * Define key.
         */
        switch (event.key) {
            case 'Enter': {
                // validate block
                if (!value.anchorBlock) return next()

                /**
                 * Define action by block type.
                 */
                switch (value.anchorBlock.type) {
                    case 'image': {
                        editor.focus()
                        return next()
                    }
                    case 'embed-link': {
                        event.preventDefault()
                        editor.splitBlock().delete().insertBlock('paragraph')
                        return true
                    }
                    case 'list-item': {
                        if (value.anchorBlock.text === '') {
                            event.preventDefault()
                            editor
                                .unwrapBlock('bulleted-list')
                                .unwrapBlock('numbered-list')
                                .setBlocks('paragraph')
                            return true
                        }
                        return next()
                    }
                    case 'separator':
                    case 'embed-post': {
                        editor.splitBlock().delete().insertBlock('paragraph')
                        return true
                    }
                    case 'blockcode': {
                        event.preventDefault()
                        editor.insertText('\n')
                        return true
                    }
                    default: {
                        // get text on current block
                        const text = value.anchorBlock.text

                        // if text is not empty
                        if (text !== '') {
                            // if text is Youtube video URL
                            if (isYoutubeVideo(text) && value.anchorBlock.type === 'paragraph') {
                                // get Youtube ID from the text
                                const youtubeID = getYoutubeID(text)

                                // define block
                                const block = value.anchorBlock

                                // define video align
                                const align = block.data.get('align')

                                // remove link
                                editor.moveToRangeOfNode(block).unwrapInline('link')
                                editor.moveFocusTo(block.key, 0)

                                // change current block into video block
                                editor.setBlocks({
                                    type: 'embed-post',
                                    data: {
                                        type: 'video',
                                        provider: 'youtube',
                                        videoID: youtubeID,
                                        align: align === undefined ? 'default' : align,
                                        url: text
                                    }
                                })
                                return true
                            } else if (isUrl(text) && value.anchorBlock.type === 'paragraph') {
                                // define block
                                const block = value.anchorBlock

                                // remove link
                                editor.moveToRangeOfNode(block).unwrapInline('link')
                                editor.moveStartTo(block.key, text.length)

                                // insert new paragraph
                                editor.insertBlock('paragraph')

                                fetch('http://localhost/fachririyanto/github/medium-text-editor/API-utils/?action=GET_WEBSITE_DATA&url=' + text)
                                .then(response => { return response.json() })
                                .then(json => {
                                    const element = document.querySelector(
                                        '*[data-key="' + block.key +'"]'
                                    )
                                    if (element) {
                                        editor.setNodeByKey(block.key, {
                                            type: 'embed-link',
                                            data: json
                                        })
                                    }
                                })
                                return true
                            } else {
                                // split block
                                editor.splitBlock()

                                let blocklist = ['title', 'h2', 'h3', 'blockquote', 'caption']
                                if (blocklist.indexOf(value.anchorBlock.type) > -1) {
                                    if (value.selection.start.offset === 0) {
                                        editor.setNodeByKey(value.anchorBlock.key, { type: 'paragraph' }).unwrapBlock('image-wrapper')
                                    } else {
                                        editor.setBlocks('paragraph').unwrapBlock('image-wrapper')
                                    }
                                }
                                return true
                            }
                        }

                        // insert new paragraph
                        editor.insertBlock('paragraph').unwrapBlock('image-wrapper')
                        return true
                    }
                }
            }

            case 'Backspace': {
                // validate block
                if (!value.anchorBlock) return next()

                // define block type
                switch (value.anchorBlock.type) {
                    case 'caption': {
                        if (value.selection.start.offset === 0 && value.selection.end.offset === 0) {
                            event.preventDefault()
                            return false
                        }
                        break
                    }
                    case 'image': {
                        // get caption block
                        const nextBlock = value.nextBlock

                        // remove caption if you remove image
                        editor.removeNodeByKey(nextBlock.key).unwrapBlock('image-wrapper').focus()
                        return next()
                    }
                    case 'list-item': {
                        // get prev block
                        const prevBlock = value.previousBlock
                        const nextBlock = value.nextBlock

                        // validate if last char
                        if (value.anchorBlock.text === '') {
                            if (!nextBlock || (nextBlock && nextBlock.type !== 'list-item') && !prevBlock || (prevBlock && prevBlock.type !== 'list-item')) {
                                editor
                                    .unwrapBlock('bulleted-list')
                                    .unwrapBlock('numbered-list')
                                    .removeNodeByKey(value.anchorBlock.key)
                                    .focus()
                                return true
                            }
                        } else {
                            if (!value.selection.isExpanded && value.selection.start.offset === 0) {
                                editor
                                    .unwrapBlock('bulleted-list')
                                    .unwrapBlock('numbered-list')
                                    .setBlocks('paragraph')
                                    .focus()
                                return true
                            }
                        }
                        return next()
                    }
                    default: return next()
                }
            }

            case 'Delete': {
                // validate block
                if (!value.anchorBlock) return next()

                // define block type
                switch (value.anchorBlock.type) {
                    case 'caption': {
                        if (value.selection.start.offset === 0 && value.selection.end.offset === 0) {
                            event.preventDefault()
                            return false
                        }
                        break
                    }
                    case 'image': {
                        // get caption block
                        const nextBlock = value.nextBlock

                        // remove caption if you remove image
                        editor.removeNodeByKey(nextBlock.key).unwrapBlock('image-wrapper').focus()
                        return next()
                    }
                    case 'list-item': {
                        // get prev block
                        const prevBlock = value.previousBlock
                        const nextBlock = value.nextBlock

                        // validate if last char
                        if (value.anchorBlock.text === '') {
                            if (!nextBlock || (nextBlock && nextBlock.type !== 'list-item') && !prevBlock || (prevBlock && prevBlock.type !== 'list-item')) {
                                editor
                                    .unwrapBlock('bulleted-list')
                                    .unwrapBlock('numbered-list')
                                    .removeNodeByKey(value.anchorBlock.key)
                                    .focus()
                                return true
                            }
                        } else {
                            if (!value.selection.isExpanded && value.selection.start.offset === 0) {
                                editor
                                    .unwrapBlock('bulleted-list')
                                    .unwrapBlock('numbered-list')
                                    .setBlocks('paragraph')
                                    .focus()
                                return true
                            }
                        }
                        return next()
                    }
                    default: return next()
                }
            }

            case ' ': {
                // validate block
                if (!value.anchorBlock) return next()

                // validate if is title block
                if (value.anchorBlock.type !== 'paragraph') return next()

                // get selection
                const { selection } = value
                if (selection.isExpanded) return next()

                // define markdown
                const { startBlock } = value
                const { start } = selection
                const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')
                const type = getType(chars)
                if (!type) return next()
                if (type === 'list-item' && startBlock.type === 'list-item') return next()

                event.preventDefault()
                editor.setBlocks(type)

                if (type === 'list-item') {
                    if (chars === '1.') {
                        editor.wrapBlock('numbered-list')
                    } else {
                        editor.wrapBlock('bulleted-list')
                    }
                }
                editor.moveFocusToStartOfNode(startBlock).delete()
                return next()
            }

            case 'ArrowRight':
            case 'ArrowDown': {
                // validate block
                if (!value.anchorBlock) return next()

                // validate if on code mark
                if (hasMark(value, 'code')) {
                    const { selection } = value
                    if (!selection.isExpanded && value.anchorBlock.text.length === selection.start.offset) {
                        editor.removeMark('code').insertText(' ')
                        return next()
                    }
                }
                return next()
            }

            case '`': {
                // validate block
                if (!value.anchorBlock) return next()

                /**
                 * Define action by block type.
                 */
                switch (value.anchorBlock.type) {
                    case 'paragraph': {
                        const { selection } = value
                        if (selection.isExpanded) {
                            event.preventDefault()
                            editor.toggleMark('code')
                            return true
                        }

                        /**
                         * Define markdown.
                         */
                        const { startBlock } = value
                        const { start } = selection
                        const char = startBlock.text.slice(0, start.offset).replace(/\s*/g, '')

                        switch (char) {
                            case '``': {
                                if (event.key === '`') {
                                    event.preventDefault()
                                    editor.moveFocusToStartOfNode(startBlock).delete().setBlocks('blockcode')
                                    return true
                                }
                                return next()
                            }
                            default:
                        }
                    }
                    default: return next()
                }
            }

            default: {
                // validate block
                if (!value.anchorBlock) return next()

                // validate undo
                if (isUndoHotkey(event)) {
                    editor.undo().focus()
                    return true
                }

                /**
                 * Define action by block type.
                 */
                switch (value.anchorBlock.type) {
                    case 'title':
                    case 'blockcode': {
                        return next()
                    }
                    case 'paragraph': {
                        /**
                         * Define markdown.
                         */
                        const { startBlock, selection } = value
                        const { start } = selection
                        const char = startBlock.text.slice(start.offset - 1, start.offset).replace(/\s*/g, '')

                        switch (char) {
                            case '`': {
                                const notallowedkeys = /`|Shift|Alt|Control|Meta/
                                if (!notallowedkeys.test(event.key)) {
                                    editor.moveFocusBackward(1).delete().addMark('code')
                                    return true
                                }
                            }
                            default:
                        }
                        
                        if (isBoldHotkey(event)) {
                            editor.toggleMark('bold')
                        } else if (isItalicHotkey(event)) {
                            editor.toggleMark('italic')
                        } else {
                            return next()
                        }
                    }
                    default: return next()
                }
            }
        }
    }
}