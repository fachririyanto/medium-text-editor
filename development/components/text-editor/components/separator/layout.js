import React from 'react'

const Separator = (props) => (
    <div className={ "block--default block--separator" + (props.isSelected ? ' -is-selected' : '') }>
        <div className="block--container" { ...props.attributes }>
            <span className="block__transform">
                <span className="separator__wrap">
                    <span className="separator__bullet"></span>
                    <span className="separator__bullet"></span>
                    <span className="separator__bullet"></span>
                </span>
            </span>
        </div>
    </div>
)
export default Separator