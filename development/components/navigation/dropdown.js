import React, { Component } from 'react'

/**
 * Dropdown component.
 */
export default class Dropdown extends Component {

    constructor(props) {
        super(props)

        /**
         * Initial state.
         */
        this.state = {
            tags: []
        }

        // define tag editor object
        this.tageditor = null
    }

    /**
     * Change post title.
     */
    onChangeTitle(event) {
        let { post } = this.props
        post.title = event.target.value
        this.props.changePost(post)
    }

    /**
     * On select featured image.
     */
    onSelectImage(event, image) {
        event.preventDefault()
        let { post } = this.props
        post.featured = image
        this.props.changePost(post)
    }

    /**
     * Render share draft link.
     * @return {Element}
     */
    ShareDraftLink() {
        return (
            <div className="dropdown__form dropdown__sharelink">
                <div className="form__field">
                    <label className="field__description">
                        Copy and send this link to someone and they’ll be able to read your draft before you publish.
                    </label>
                    <span className="field__component">
                        <input id="dropdown--draft-link" onFocus={ event => event.target.select() } className="field__textbox" type="text" value={ this.props.post.draftLink } readOnly />
                    </span>
                </div>
                <div className="form__action U--text--right">
                    <button className="button -size-small -rounded" onClick={ event => this.props.changeLayout(event, 'default') }>Done</button>
                </div>
            </div>
        )
    }

    /**
     * Render change featured image.
     * @return {Element}
     */
    ChangeFeaturedImage() {
        const { value } = this.props
        const { document } = value
        const blocks = document.nodes.toArray()

        // get post data
        const { post } = this.props

        // get list of images
        let images = []
        for (let i = 0;i < blocks.length;i++) {
            if (blocks[i].type === 'image') {
                images.push(blocks[i].data.get('url'))
            }
        }

        // create image list element
        let featured = images.map((url, index) => <div key={ index } className="image__card"><div onClick={ event => this.onSelectImage(event, { id: index, url: url }) } className={ "image__item U--background-cover" + (index === post.featured.id ? ' -is-selected' : '') } style={{ backgroundImage: `url(${url})`}}><span className="image__ratio"></span></div></div>)
        return (
            <div className="dropdown__form dropdown__display-featured-image">
                <div className="form__field">
                    <label className="field__label">
                        { images.length === 0 ? 'Tip: add a high-quality image to your story to capture people’s interest.' : 'Select one of your images to feature.' }
                    </label>
                </div>
                <div className="form__field form__option-images">
                    <div className="image__list row">{ featured }</div>
                </div>
                <div className="form__divider"></div>
                <div className="form__action U--text--right">
                    <button className="form__button button -size-small -rounded" onClick={ event => this.props.changeLayout(event, 'default') }>Done</button>
                </div>
            </div>
        )
    }

    /**
     * Render change display title.
     * @return {Element}
     */
    ChangeDisplayTitle() {
        return (
            <div className="dropdown__form dropdown__display-title">
                <div className="form__field -horizontal">
                    <span className="U--table">
                        <span className="table__cell -auto-width -vertical-align--middle">
                            <label className="field__label">
                                Title
                            </label>
                        </span>
                        <span className="table__cell">
                            <span className="field__component">
                                <input
                                    type="text"
                                    value={ this.props.post.title }
                                    className="field__textbox"
                                    placeholder="Add post title"
                                    onChange={ this.onChangeTitle.bind(this) }
                                />
                            </span>
                        </span>
                    </span>
                </div>
                <div className="form__field">
                    <span className="field__description">
                        The title and subtitle are used on your publication homepage, in previews of your story on Medium, and on social media.
                    </span>
                </div>
                <div className="form__action U--text--right">
                    <button className="form__button button -size-small -rounded" onClick={ event => this.props.changeLayout(event, 'default') }>Done</button>
                </div>
            </div>
        )
    }

    /**
     * Render add tags.
     * @return {Element}
     */
    onChangeTag() {
        this.setState({
            tag: this.tageditor.innerHTML
        })
    }
    onAddTag(event) {
        const { keyCode } = event
        switch (keyCode) {
            case 13: {
                event.preventDefault()
                let tags = this.state.tags
                tags.push(this.tageditor.innerHTML)
                this.tageditor.innerHTML = ''
                this.setState({
                    tags: tags
                })
                break
            }
            case 8: {
                let { tags } = this.state
                if (tags.length === 0) return
                if (this.tageditor.innerHTML === '') {
                    tags.pop()
                    this.setState({
                        tags: tags
                    })
                }
                break
            }
            default:
        }
    }
    onRemoveTag(event, index) {
        event.preventDefault()
        let { tags } = this.state
        tags.splice(index)
        this.setState({
            tags: tags
        })
    }
    AddTags() {
        const { tags } = this.state
        const lists = tags.map((tag, index) => (
            <span key={ index } className="tag__item">
                <span className="item__label">{ tag }</span>
                <button className="item__button" onClick={ event => this.onRemoveTag(event, index) }>
                    <i className="material-icons">close</i>
                </button>
            </span>
        ))
        return (
            <div className="dropdown__form dropdown__add-tags">
                <div className="form__field">
                    <label className="field__description">Add or change tags (up to 5) so readers know what your story is about:</label>
                    <br />
                </div>
                <div className="form__field">
                    <div className="form__tags">
                        <div className="tags__list">{ lists }</div>
                        { this.state.tags.length >= 5 ? null : (
                            <div className="tags__form">
                                { !this.tageditor || this.tageditor && this.tageditor.innerHTML === '' ? <span className="tags__placeholder">Add a tag...</span> : null }
                                <div ref={ node => this.tageditor = node } className="tags__input" contentEditable={ true } onInput={ this.onChangeTag.bind(this) } onKeyDown={ this.onAddTag.bind(this) }></div>
                            </div>
                        ) }
                    </div>
                </div>
                <div className="form__divider"></div>
                <div className="form__action U--text--right">
                    <button className="form__button button -size-small -rounded" onClick={ event => this.props.changeLayout(event, 'default') }>Done</button>
                </div>
            </div>
        )
    }

    /**
     * Render menu.
     * @return {Element}
     */
    Menu() {
        return (
            <ul className="dropdown__list">
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'share-draft-link', () => setTimeout(() => { document.getElementById('dropdown--draft-link').focus() }, 0)) }>
                        Share draft link
                    </button>
                </li>
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'share-draft-link') }>
                        Delete story
                    </button>
                </li>
                <li className="dropdown__divider"></li>
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'change-featured-image') }>
                        Change featured image
                    </button>
                </li>
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'change-display-title') }>
                        Change display title
                    </button>
                </li>
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'add-tags') }>
                        Add tags
                    </button>
                </li>
                <li className="dropdown__divider"></li>
                <li className="dropdown__item">
                    <button className="dropdown__button" onClick={ event => this.props.changeLayout(event, 'share-draft-link') }>
                        Keyboard shortcut
                    </button>
                </li>
            </ul>
        )
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        let layout = null
        let isInside = false
        switch (this.props.layout) {
            case 'share-draft-link': {
                layout   = this.ShareDraftLink()
                isInside = true
                break
            }
            case 'change-featured-image': {
                layout   = this.ChangeFeaturedImage()
                isInside = true
                break
            }
            case 'change-display-title': {
                layout   = this.ChangeDisplayTitle()
                isInside = true
                break
            }
            case 'add-tags': {
                layout   = this.AddTags()
                isInside = true
                break
            }
            default: {
                layout   = this.Menu()
                isInside = false
                break
            }
        }
        return (
            <div className={ "menu__dropdown" + (this.props.isOpen ? ' -is-open' : '') + (isInside ? ' -is-inside' : '') }>
                <div className="dropdown__wrap">
                    <span className="dropdown__caret"></span>
                    <div className="dropdown__content">
                        { layout }
                    </div>
                </div>
            </div>
        )
    }
}