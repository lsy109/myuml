import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Editor from './Editor.js'; // 假設 Editor 組件位於 './Editor'

describe('Editor Component', () => {
    test('should update text on change', () => {
        const mockTextChange = jest.fn();
        render(<Editor onTextChange={mockTextChange} />);

        const inputElement = screen.getByRole('textbox');
        const testText = `@startuml
Bob -> Alice : hello
@enduml`;

        fireEvent.change(inputElement, { target: { value: testText } });

        expect(mockTextChange).toHaveBeenCalledWith(testText);
        // 如果 Editor 組件內部也更新了狀態，可以額外驗證那部分的狀態變更
    });
});
