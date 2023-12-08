import React from 'react';
import Menu from '../Menu.js';
import Container from '../Container.js';


class Index extends React.Component {
    render() {
        return (
            <div className="window">
                <nav>
                    <label className="logo">myUML <label className="version">v20230918</label>
                    </label>
                    <Menu />
                    <div id="searchDiv">
                        <input type="text" id="search" name="search" placeholder="🔍Search" />
                    </div>
                </nav>


                <Container />

                <footer>
                    <p style={{ margin: '15px' }}><a style={{ color: '#c8c8c8' }} href="https://sites.google.com/mail.nknu.edu.tw/cph/home">🌏HIE Lab | Ⓖ 🚀 Ⓖ | 🛸 Ⓖ | 🚜 Ⓦ&emsp;</a></p>
                    <p style={{ margin: '15px' }}><a style={{ color: '#c8c8c8' }} href="https://sites.google.com/mail.nknu.edu.tw/iecnknu/%E9%A6%96%E9%A0%81"> &emsp;🌏NKNU-IEC Ⓖ Ⓕ Ⓑ</a></p>
                    <p style={{ margin: '15px' }}>© 2008-2021 Power by Po-Hsun Cheng (鄭伯壎) and Li-Wei Chen (陳立偉),</p>
                    <p style={{ margin: '15px' }}>Information Education Center, National Kaohsiung Normal University, Taiwan.</p>
                    <p style={{ margin: '15px' }}>Source: SUN-YONG Lau (劉孫湧) </p>
                </footer>
            </div>
        );
    }
}

export default Index;