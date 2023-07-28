// parser.js
import React, { useEffect } from 'react';
import Editor from './AceEditor';
import { render } from '@testing-library/react';

function toEditor(canvasItem) {

    render(
        <Editor value={canvasItem} />
    )



}

export default {
    toEditor
};
