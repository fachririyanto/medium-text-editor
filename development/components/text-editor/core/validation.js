/**
 * Validate if is block toolbar condition.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export const isBlockToolbar = (value) => {
    if (!value.anchorBlock) return true
    const block = value.anchorBlock

    // if block is title
    if (block.type === 'title') return true

    // other block
    const allow = ['paragraph']
    return block.text === '' && allow.indexOf(block.type) > -1 ? true : false
}

/**
 * Validate if is inline toolbar condition.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export const isInlineToolbar = (value) => {
    const allow = ['paragraph', 'blockquote', 'h2', 'h3', 'embed-link', 'caption', 'list-item']
    return value.fragment.text !== '' && allow.indexOf(value.anchorBlock.type) > -1 ? true : false
}

/**
 * Validate if is void toolbar condition.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export const isVoidToolbar = (value) => {
    const allow = ['embed-post', 'image']
    return allow.indexOf(value.anchorBlock.type) > -1 ? true : false
}

/**
 * Validate if its first block.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export const isFirstBlock = (value) => {
    const block = value.anchorBlock
    if (!block) return true
    const prevBlock = value.document.getPreviousBlock(block.key)
    return prevBlock === null ? true : false
}

/**
 * Validate if its placeholder state.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export const isPlaceholderState = (value) => {
    if (isFirstBlock(value)) {
        if (value.anchorBlock && value.anchorBlock.type === 'title' && value.anchorBlock.text === '') {
            return true
        }
    }
    return false
}