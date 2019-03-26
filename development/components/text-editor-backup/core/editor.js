import { ELEMENT_DEFAULT_RANGE } from './variable'
import { isBlockToolbar, isInlineToolbar, isVoidToolbar } from './validation'

/**
 * Init toolbar.
 * @since 1.0.0
 */
export const initToolbar = (editor, value) => {
    if (isBlockToolbar(value)) {
        initBlockToolbar(editor, value)
    } else if (isInlineToolbar(value)) {
        initInlineToolbar(editor, value)
    } else if (isVoidToolbar(value)) {
        initVoidToolbar(editor, value)
    }
}

/**
 * Toolbar block init.
 * @since 1.0.0
 */
export const initBlockToolbar = (editor, value) => {
    if (!value.anchorBlock) return

    // define default element range
    let range = ELEMENT_DEFAULT_RANGE

    // get element
    let element = document.querySelector(
        '*[data-key="' + value.anchorBlock.key +'"]'
    )

    // if element already rendered
    if (element !== null) {
        // get element range
        range = element.getBoundingClientRect()

        // validate if toolbar in front of image
        const children = element.children[0]
        if (children) {
            const subchild = children.getElementsByTagName('span')[0]
            const childrenRange = subchild.getBoundingClientRect()
            if (childrenRange.left > range.left) {
                editor.toolbar.ref.style.display = 'none'
                return
            }
        }

        // update toolbar position
        const toolbar = editor.toolbar.ref
        toolbar.style.display = 'block'
        if (value.anchorBlock.type === 'title') {
            toolbar.style.top  = `${range.top + window.pageYOffset - 112}px`
            toolbar.style.left = `${range.left + window.pageXOffset - 88}px`
        } else {
            toolbar.style.top  = `${range.top + window.pageYOffset - 112 + ((range.height - 38) / 2)}px`
            toolbar.style.left = `${range.left + window.pageXOffset - 56}px`
        }
    } else {
        setTimeout(() => {
            initToolbar(editor, value)
        }, 0)
    }
}

/**
 * Toolbar inline init.
 * @since 1.0.0
 */
export const initInlineToolbar = (editor, value) => {
    const toolbar = editor.toolbar.ref;
    if (!toolbar) return;

    // set default range
    let range = ELEMENT_DEFAULT_RANGE;

    // get selection range position
    if (value.selection.isBlurred || value.selection.isCollapsed) {
        // range = editor.toolbar.range
        return
    } else {
        const selection = window.getSelection()
        const selectionRange = selection.getRangeAt(0)
        range = selectionRange.getBoundingClientRect()
    }

    // re-position toolbar position
    const oldValue = editor.props.value
    if (oldValue !== value) {
        setTimeout(() => {
            initInlineToolbar(editor, value)
        }, 0)
    }

    // update menu
    if (range) {
        editor.setToolbarRange(range)

        // setup menu style
        toolbar.style.display = 'block'
        toolbar.style.top  = `${range.top + window.pageYOffset - 157}px`
        toolbar.style.left = `${range.left + window.pageXOffset + ((range.width - toolbar.offsetWidth) / 2)}px`
    }
}

/**
 * Toolbar void init.
 * @since 1.0.0
 */
export const initVoidToolbar = (editor, value) => {
    const toolbar = editor.toolbar.ref
    if (!toolbar) return

    // set default range
    let range = ELEMENT_DEFAULT_RANGE

    // get element
    let element = document.querySelector(
        '*[data-key="' + value.anchorBlock.key +'"]'
    )

    if (element !== null) {
        range = element.getBoundingClientRect()

        // update menu
        editor.setToolbarRange(range)

        // setup menu style
        toolbar.style.display = 'block'
        toolbar.style.top = `${range.top + window.pageYOffset - toolbar.offsetHeight - 127}px`
        if (value.anchorBlock.data.get('align') === 'left') {
            toolbar.style.left = `${(range.left - toolbar.offsetWidth / 2 + range.width / 2) - 260}px`
        } else {
            toolbar.style.left = `${range.left - toolbar.offsetWidth / 2 + range.width / 2}px`
        }
    } else {
        setTimeout(() => {
            initVoidToolbar(toolbar, value);
        }, 0)
    }
}