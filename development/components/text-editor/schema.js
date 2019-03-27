import { Block } from 'slate'

export default {
    document: {
        last: [
            { type: 'h2' },
            { type: 'h3' },
            { type: 'paragraph' },
            { type: 'separator' },
            { type: 'blockquote' },
            { type: 'embed-post' },
            { type: 'embed-link' },
            { type: 'image' },
            { type: 'bulleted-list' },
            { type: 'numbered-list' },
            { type: 'list-item' }
        ],
        normalize: (editor, { code, node, child }) => {
            switch (code) {
                case 'last_child_type_invalid': {
                    const paragraph = Block.create('paragraph')
                    return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
                }
            }
        },
        nodes: [{
            match: [
                { type: 'title' },
                { type: 'h2' },
                { type: 'h3' },
                { type: 'paragraph' },
                { type: 'separator' },
                { type: 'blockquote' },
                { type: 'blockcode' },
                { type: 'embed-post' },
                { type: 'embed-link' },
                { type: 'image-wrapper' },
                { type: 'image' },
                { type: 'caption' },
                { type: 'bulleted-list' },
                { type: 'numbered-list' },
                { type: 'list-item' }
            ],
            min: 0
        }]
    },
    inlines: {
        code: {
            isVoid: false
        },
        break: {
            isVoid: true
        }
    },
    blocks: {
        image: {
            isVoid: true
        },
        separator: {
            isVoid: true
        },
        "embed-link": {
            isVoid: true
        },
        "embed-post": {
            isVoid: true
        }
    }
}