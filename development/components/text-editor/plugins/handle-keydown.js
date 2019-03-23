import { isKeyHotkey } from 'is-hotkey'
import isUrl from 'is-url'
import { isYoutubeVideo } from '../../../helpers/validation'
import { getYoutubeID } from '../../../helpers/utils'

/**
 * Define hotkey matchers.
 * @type {Function}
 */
const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUndoHotkey = isKeyHotkey('mod+z')

/**
 * Define block type by char.
 */
const getType = (char) => {
    if (/[0-9].$/.test(char)) return 'list-item'
    switch (char) {
        case '-':
        case '+':
            return 'list-item'
        case '>':
            return 'blockquote'
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

        // with special key
        if (event.key === 'Enter' && event.shiftKey) {
            if (value.anchorBlock.type === 'paragraph') {
                editor.insertInline({
                    type: 'break',
                    data: {}
                })
                .moveToStartOfNextText()
                .focus()

                return true
            }
        }

        // without special key
        switch (event.key) {
            case 'Enter': {
                // validate block
                if (!value.anchorBlock) return next()

                // if image block, next to caption
                if (value.anchorBlock.type === 'image') {
                    editor.focus()
                    return next()
                }

                // if bulleted list
                if (value.anchorBlock.type === 'list-item') {
                    if (value.anchorBlock.text === '') {
                        event.preventDefault()
                        editor
                            .unwrapBlock('bulleted-list')
                            .unwrapBlock('numbered-list')
                            .setBlocks('paragraph')
                        return true
                    }
                }

                // custom block list
                const voidblock = ['separator', 'embed-post']
                if (voidblock.indexOf(value.anchorBlock.type) > -1) {
                    editor.splitBlock().delete().insertBlock('paragraph')
                    return true
                }

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
                        editor.setBlocks({
                            type: 'embed-link',
                            data: {
                                url: text
                            }
                        }).insertBlock('paragraph')
                        return true
                    } else {
                        // split block
                        editor.splitBlock()

                        let blocklist = ['title', 'h2', 'h3', 'blockquote', 'caption']
                        if (blocklist.indexOf(value.anchorBlock.type) > -1) {
                            if (value.selection.start.offset === 0) {
                                editor.setNodeByKey(value.anchorBlock.key, { type: 'paragraph' })
                            } else {
                                editor.setBlocks('paragraph')
                            }
                        }
                        return true
                    }
                }

                // insert new paragraph
                editor.insertBlock('paragraph')
                return true
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
                        editor.removeNodeByKey(nextBlock.key).focus()
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
                    case 'caption':
                        if (value.selection.start.offset === 0 && value.selection.end.offset === 0) {
                            event.preventDefault()
                            return false
                        }
                        break
                    case 'image':
                        // get caption block
                        const nextBlock = value.nextBlock

                        // remove caption if you remove image
                        editor.removeNodeByKey(nextBlock.key).focus()
                        return next()

                    default:
                        return next()
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
                    if (/[0-9].$/.test(chars)) {
                        editor.wrapBlock('numbered-list')
                    } else {
                        editor.wrapBlock('bulleted-list')
                    }
                }
                editor.moveFocusToStartOfNode(startBlock).delete()
                return next()
            }

            default:
                // validate block
                if (!value.anchorBlock) return next()

                // validate if is title block
                if (value.anchorBlock.type === 'title') return next()

                if (isBoldHotkey(event)) {
                    editor.toggleMark('bold')
                } else if (isItalicHotkey(event)) {
                    editor.toggleMark('italic')
                } else if (isUndoHotkey(event)) {
                    editor.undo().focus()
                } else {
                    return next()
                }
        }
    }
}