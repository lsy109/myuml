import React from 'react';

// class FuncMenu extends React.Component {

// }

class Menu extends React.Component {
    render() {
        return (
            <ul>
                <li className="drop">
                    <a href="/" className="dropdown" id="file">File</a>

                    <div className="dropdown-content">
                        <a href="/">New</a>
                        <a href="/">Open</a>
                        <a href="/">Save</a>
                        <a href="/">Save as</a>
                        <a href="/">Close</a>
                    </div>
                </li>
                <li className="drop">
                    <a href="/" className="dropdown" id="edit">Edit</a>
                    <div className="dropdown-content">
                        <a href="/">Connection</a>
                        <a href="/">Unit</a>
                        <a href="/">Color</a>
                        <a href="/">Search</a>
                    </div>
                </li>
                <li>
                    <a href="/">Source</a>
                </li>
                <li>
                    <a href="/">About</a>
                </li>
            </ul>
        );
    }
}

export default Menu;