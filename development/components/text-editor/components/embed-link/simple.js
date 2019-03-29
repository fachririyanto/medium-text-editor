import React, { Component } from 'react'
import Card from '../../../card/layout'

/**
 * Embed link component.
 * @version 1.0.0
 * @author Fachri Riyanto
 */
export default class EmbedLink extends Component {

    /**
     * Create markup HTML.
     * @return {Element}
     */
    createMarkup(content) {
        return { __html: content }
    }

    /**
     * Render link.
     * @return {Element}
     */
    Link() {
        const { node } = this.props
        const data = {
            title: node.data.get('title'),
            image: node.data.get('image'),
            description: node.data.get('description'),
            domain: node.data.get('domain')
        }
        return (
            <Card className="link__card -rounded">
                <div className="link__table U--table">
                    <div className="table__cell -auto-width">
                        <div className="link__thumbnail U--background-cover" style={{ backgroundImage: `url(${data.image})` }}></div>
                    </div>
                    <div className="table__cell -vertical-align--middle">
                        <div className="link__metadata">
                            <h4 className="metadata__title" dangerouslySetInnerHTML={ this.createMarkup(data.title) }></h4>
                            <span
                                className="metadata__description"
                                dangerouslySetInnerHTML={ this.createMarkup(data.description ? data.description : '' )}
                            ></span>
                            <span className="metadata__domain">{ data.domain.host }</span>
                        </div>
                    </div>
                </div>
                <div className="link__overlay U--overlay-layout"></div>
            </Card>
        )
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        const { attributes, isFocused } = this.props
        return (
            <div className={ "block--default block--embed-link" + (isFocused ? ' -is-selected' : '') }>
                <div className="block--container" { ...attributes }>
                    <span className="block__transform">
                        { this.Link() }
                        <span className="link__focused U--overlay-layout"></span>
                    </span>
                </div>
            </div>
        )
    }   
}