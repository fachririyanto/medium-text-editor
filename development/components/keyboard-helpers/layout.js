import React from 'react'

export default function KeyboardHelpers(props) {
    return (
        <section className="M--keyboard-helpers">
            <div className="helpers__wrapper">
                <div className="helpers__container">
                    <header className="block--header U--text--center">
                        <h3 className="header__title">Keyboard Shortcuts</h3>
                    </header>
                    <div className="helpers__body U--table -fixed">
                        <div className="table__cell">
                            <div className="shortcuts__list U--table">
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>Alt</code>
                                        <span>+</span>
                                        <code>1</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Bigger header or title</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>Alt</code>
                                        <span>+</span>
                                        <code>1</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Smaller header or subtitle</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>Alt</code>
                                        <span>+</span>
                                        <code>5</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Quote style</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>*</code>
                                        <code>Space</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Bulleted list</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>1</code>
                                        <code>.</code>
                                        <code>Space</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Ordered list</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="table__cell">
                            <div className="shortcuts__list U--table">
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>B</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Bold</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>I</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Italic</label>
                                    </div>
                                </div>
                                <div className="list__item table__row">
                                    <div className="table__cell -auto-width">
                                        <code>Cmd</code>
                                        <span>+</span>
                                        <code>K</code>
                                    </div>
                                    <div className="table__cell -vertical-align--middle">
                                        <label>Turn into a link<br/><small>Works for text and images</small></label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="helpers__button-close" onClick={ event => props.toggleKeyboardShortcut(event, false) }>
                    <i className="material-icons">close</i>
                </button>
            </div>
        </section>
    )
}