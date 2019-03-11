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

export default {
    /**
     * Add toggle mark.
     */
    onKeyDown(event, editor, next) {

        // with special key
        if (event.key === 'Enter' && event.shiftKey) {
            const { value } = editor
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
                // get value
                const { value } = editor

                // validate block
                if (!value.anchorBlock) return next()

                // if image block, next to caption
                if (value.anchorBlock.type === 'image') {
                    editor.focus()
                    return next()
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
                    if (isYoutubeVideo(text)) {
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
                    } else if (isUrl(text)) {
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
                // get value
                const { value } = editor

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

                    default: return next()
                }
            }
            case 'Delete': {
                // get value
                const { value } = editor

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
            default:
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