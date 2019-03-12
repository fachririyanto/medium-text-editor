import React from 'react'
import YoutubeVideo from './video/youtube'

const EmbedPost = (props) => {
    const { node } = props
    const data = {
        type: node.data.get('type'),
        provider: node.data.get('provider')
    }

    switch (data.type) {
        case 'video':
            switch (data.provider) {
                case 'youtube': return <YoutubeVideo { ...props } />
                default: return null
            }

        default: return null
    }
}
export default EmbedPost