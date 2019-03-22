export default {
    document: {
        nodes: [{
            match: [
                { type: 'title' },
                { type: 'h2' },
                { type: 'h3' },
                { type: 'paragraph' },
                { type: 'separator' },
                { type: 'blockquote' },
                { type: 'embed-post' },
                { type: 'embed-link' },
                { type: 'image' },
                { type: 'caption' },
                { type: 'bulleted-list' },
                { type: 'list-item' }
            ],
            min: 0
        }]
    },
    inlines: {
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