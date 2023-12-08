import React, { Component } from 'react';

class ContextMenu extends Component {
    render() {
        const { x, y, menuItems } = this.props;
        console.log(menuItems)
        const menuStyle = {
            top: y,
            left: x,
            position: 'absolute'
        };

        return (
            <ul style={menuStyle} className="context-menu">
                {menuItems.map((item, index) => (
                    <li key={index} >
                        {item.label}
                        {
                            item.subMenu && (
                                <ul className="submenu">
                                    {item.subMenu.map((subItem, subIndex) => (
                                        <li key={subIndex}>{subItem}</li>
                                    ))}
                                </ul>
                            )
                        }
                    </li>
                ))
                }
            </ul>
        );
    }
}

export default ContextMenu;
