import React from 'react'

const YoutubeVideo = (props) => {
    const { node, attributes, isFocused } = props
    const data = {
        videoID: node.data.get('videoID'),
        align: node.data.get('align')
    }
    return (
        <div className={ "block--default block--embed-post block--video video--youtube" + (isFocused ? ' -is-selected' : '') }>
            <div className={ "block--container -" + data.align } { ...attributes }>
                <div className="block__transform">
                    <div className="video__thumbnail">
                        <iframe
                            title="Video from Youtube"
                            width="100%"
                            height="100%"
                            src={ "https://www.youtube.com/embed/" + data.videoID }
                            frameBorder="0"
                            allowFullScreen={1}
                            className="U--overlay-layout"
                        />
                        <span className="video__overlay U--overlay-layout"></span>
                    </div>
                </div>
                <span className="video__focused U--overlay-layout"></span>
            </div>
        </div>
    )
}
export default YoutubeVideo