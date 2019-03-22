import React from 'react'
import Button from '../button/layout'
import Dropdown from './dropdown'

/**
 * Navigation module.
 * @author Fachri Riyanto
 */
const Navigation = (props) => (
    <section className="M--navigation type--1" id={ props.id }>
        <nav className="navigation">
            <div className="container">
                <div className="U--table -full-height">
                    <div className="table__cell -vertical-align--middle">
                        <h1 className="site--name">
                            <a href="/">M</a>
                        </h1>
                    </div>
                    <div className="table__cell -vertical-align--middle -auto-width">
                        <ul className="navigation__menu">
                            <li className="menu__item" ref={ props.forwardedRef }>
                                <button className="button--more" onClick={ props.toggleOption }>
                                    <i className="material-icons">more_horiz</i>
                                </button>
                                <Dropdown { ...props } />
                            </li>
                            <li className="menu__item">
                                <Button className="button--publish -rounded -theme-primary -size-small" onClick={ event => props.savePost(event) }>Publish</Button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </section>
)
export default Navigation