import React, { Component } from 'react'
import Card from '../../../card/layout'

/**
 * Embed link component.
 * @version 1.0.0
 * @author Fachri Riyanto
 */
export default class EmbedLink extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            data: {}
        }
    }

    /**
     * Create markup HTML.
     * @return {Element}
     */
    createMarkup(content) {
        return { __html: content }
    }

    /**
     * Get website meta data.
     */
    componentDidMount() {
        const { node } = this.props
        const { data } = node
        const url      = data.get('url')

        fetch('http://localhost/github/medium-text-editor/API-utils/?action=GET_WEBSITE_DATA&url=' + url)
        .then(response => { return response.json() })
        .then(json => {
            this.setState({
                isLoading: false,
                data: json
            })
        })
    }

    /**
     * Render loader.
     * @return {Element}
     */
    Loader() {
        return (
            <Card className="link__card -rounded">
                <div className="link__table U--table">
                    <div className="table__cell -auto-width">
                        <div className="link__thumbnail"></div>
                    </div>
                    <div className="table__cell -vertical-align--middle">
                        <div className="link__metadata-placeholder">
                            <span className="placeholder__title"></span>
                            <span className="placeholder__description"></span>
                            <span className="placeholder__domain"></span>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }

    /**
     * Render link.
     * @return {Element}
     */
    Link() {
        const { data } = this.state
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
        const { node, attributes, isFocused } = this.props
        const { data } = node
        const url      = data.get('url')
        return (
            <div className={ "block--default block--embed-link" + (isFocused ? ' -is-selected' : '') }>
                <div className="block--container" { ...attributes }>
                    <span className="block__transform">
                        { this.state.isLoading ? this.Loader() : this.Link() }
                    </span>
                    <span className="link__focused U--overlay-layout"></span>
                </div>
            </div>
        )
    }   
}