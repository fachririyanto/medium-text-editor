import React, { Component } from 'react'
import { render } from 'react-dom'
import { Value } from 'slate'

/* import validation */
import { isMobile } from './helpers/validation'

/* import components */
import Navigation from './components/navigation/layout'
import Editor from './components/text-editor/layout'
import MobileEditor from './components/text-editor-mobile/layout'

/* import styles */
import './styles/style.scss'

/**
 * Define initial value.
 */
const initialValue = Value.fromJSON({
    document: {
        nodes: [
            {
                object: 'block',
                type: 'title',
                nodes: [
                    {
                        object: 'text',
                        leaves: [
                            { text: '' }
                        ]
                    }
                ]
            }
        ]
    }
})

/**
 * Main app component.
 * @version 1.0.0
 * @author Fachri Riyanto
 */
class App extends Component {

    /**
     * Class constructor. 
     */
    constructor(props) {
        super(props)

        this.state = {
            value: initialValue,

            // define post state
            post: {
                title: '',
                featured: {
                    id: 0,
                    url: ''
                },
                draftLink: 'https://fachririyanto.com/experiments/medium-text-editor/',
                tags: []
            },

            // define option state
            isOpenOption: false,
            optionLayout: 'default'
        }

        // button more object
        this.buttonMore = null
    }

    /**
     * Registering new event listener.
     */
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside.bind(this))
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside.bind(this))
    }

    /**
     * Handle click outside the box.
     */
    handleClickOutside(event) {
        if (this.buttonMore && !this.buttonMore.contains(event.target)) {
            if (this.state.isOpenOption === true) {
                this.setState({
                    isOpenOption: false,
                    optionLayout: 'default'
                })
            }
        }
    }

    /**
     * Toggle Option.
     */
    toggleOption(event) {
        event.preventDefault()
        this.setState({
            isOpenOption: !this.state.isOpenOption,
            optionLayout: 'default'
        })
    }

    /**
     * Change post data.
     * @param {Object} post
     */
    changePost(post) {
        this.setState({
            post: post
        })
    }

    /**
     * Change layout.
     */
    changeLayout(event, layout, callback) {
        event.preventDefault()
        this.setState({
            optionLayout: layout
        }, () => {
            if (callback) {
                callback()
            }
        })
    }

    /**
     * On change content.
     */
    onChange = ({ value }, callback) => {
        this.setState({ value }, () => callback())
    }

    /**
     * Publish post.
     */
    savePost(event) {
        event.preventDefault()
        console.log(this.state.value.toJSON())
    }

    /**
     * Render element.
     * @return {Element}
     */
    render() {
        return (
            <section className="P--app" id="page--app">
                <Navigation
                    forwardedRef={ node => this.buttonMore = node }
                    value={ this.state.value }
                    isOpen={ this.state.isOpenOption }
                    layout={ this.state.optionLayout }
                    post={ this.state.post }
                    changePost={ this.changePost.bind(this) }
                    changeLayout={ this.changeLayout.bind(this) }
                    toggleOption={ this.toggleOption.bind(this) }
                    savePost={ this.savePost.bind(this) }
                />
                { isMobile() ? (
                    <MobileEditor
                        value={ this.state.value }
                        onChange={ this.onChange }
                        placeholder="Title"
                    />
                ) : (
                    <div className="app__text-editor">
                        <Editor
                            value={ this.state.value }
                            onChange={ this.onChange }
                            placeholder="Title"
                        />
                    </div>
                )}
            </section>
        )
    }
}

/**
 * Render editor.
 */
render(
    <App />,
    document.getElementById('root')
)