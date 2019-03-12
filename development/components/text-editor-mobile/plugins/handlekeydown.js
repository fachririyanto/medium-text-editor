export default {
    /**
     * Add toggle mark.
     */
    onKeyDown(event, editor, next) {

        // without special key
        switch (event.key) {
            case 'Enter': {
                event.preventDefault()

                editor.splitBlock()
                editor.setBlocks('paragraph')
                return false
            }
            case 'Backspace': {
                // get value
                const { value } = editor

                // validate block
                if (!value.anchorBlock) {
                    event.preventDefault()
                    return
                }
                if (value.anchorBlock.text === '' && !value.previousBlock) {
                    event.preventDefault()
                    return
                }
                return next()
            }
            default:
                return next()
        }
    }
}