/**
 * Validate if is block toolbar condition.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export function isBlockToolbar(value) {
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
export function isInlineToolbar(value) {
    const allow = ['paragraph', 'blockquote', 'h2', 'h3', 'embed-link', 'caption', 'list-item']
    return value.fragment.text !== '' && allow.indexOf(value.anchorBlock.type) > -1 ? true : false
}

/**
 * Validate if is void toolbar condition.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export function isVoidToolbar(value) {
    const allow = ['embed-post', 'image']
    return allow.indexOf(value.anchorBlock.type) > -1 ? true : false
}

/**
 * Validate if its first block.
 * @param {Object} value Editor value.
 * @return {Bool}
 */
export function isFirstBlock(value) {
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
export function isPlaceholderState(value) {
    if (isFirstBlock(value)) {
        if (value.anchorBlock && value.anchorBlock.type === 'title' && value.anchorBlock.text === '') {
            return true
        }
    }
    return false
}

/**
 * Validate if content already has title block.
 */
export function hasTitle(value) {
    let hasTitle = 0
    value.document.nodes.map((node) => {
        if (node.type === 'title') hasTitle += 1
    })
    return hasTitle === 0 ? false : true
}

/**
 * Validate if has mark.
 */
export function hasMark(value, type) {
    return value.activeMarks.some(mark => mark.type == type)
}

/**
 * Validate if has block.
 */
export function hasBlock(value, type) {
    if (type === 'title') {
        if (hasTitle(value)) {
            type = 'h2'
        }
    }
    return value.blocks.some(node => node.type == type)
}

/**
 * Validate if has inline.
 */
export function hasInline(value, type) {
    return value.inlines.some(inline => inline.type === type)
}