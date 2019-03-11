import React from 'react'
import MenuItem from './menu-item'

/**
 * Navigation container.
 * @author Fachri Riyanto
 */
export const NavContainer = (props) => (
    <section className="M--navigation type--1" id={ props.id }>
        <nav className="navigation">
            <div className="container">
                { props.children }
            </div>
        </nav>
    </section>
)

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
                            <a href="/">{ props.title }</a>
                        </h1>
                    </div>
                    <div className="table__cell -vertical-align--middle -auto-width">
                        <ul className="navigation__menu">
                            { props.menus.map(menu => <MenuItem key={ menu.id } menu={ menu } />) }
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </section>
)
export default Navigation