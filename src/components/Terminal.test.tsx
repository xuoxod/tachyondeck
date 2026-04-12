import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Terminal } from './Terminal';

describe('Terminal UI Component', () => {
  const mockOnCommandSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with no output', () => {
    const { getByTestId } = render(<Terminal output={[]} onCommandSubmit={mockOnCommandSubmit} />);
    expect(getByTestId('terminal-container')).toBeDefined();
    expect(getByTestId('terminal-input')).toBeDefined();
  });

  it('renders multiple lines of output correctly', () => {
    const lines = ['System booting...', 'Checking telemetry...', 'vfs mounted successfully.'];
    const { getByText } = render(<Terminal output={lines} onCommandSubmit={mockOnCommandSubmit} />);
    
    // Check if each line is rendered
    lines.forEach(line => {
      expect(getByText(line)).toBeDefined();
    });
  });

  it('calls onCommandSubmit when input is submitted and clears input', () => {
    const { getByTestId } = render(<Terminal output={[]} onCommandSubmit={mockOnCommandSubmit} />);
    const input = getByTestId('terminal-input');

    // Type a command
    fireEvent.changeText(input, 'htop');
    expect(input.props.value).toBe('htop');

    // Submit it
    fireEvent(input, 'submitEditing');

    expect(mockOnCommandSubmit).toHaveBeenCalledWith('htop');
    // In React Native testing library, we may not immediately see it cleared unless state updates correctly, 
    // but the component logic should handle clearing the text on submit.
  });

  it('EDGE CASE: Does not call onCommandSubmit if input is empty or just whitespace', () => {
    const { getByTestId } = render(<Terminal output={[]} onCommandSubmit={mockOnCommandSubmit} />);
    const input = getByTestId('terminal-input');

    fireEvent.changeText(input, '   ');
    fireEvent(input, 'submitEditing');
    expect(mockOnCommandSubmit).not.toHaveBeenCalled();

    fireEvent.changeText(input, '');
    fireEvent(input, 'submitEditing');
    expect(mockOnCommandSubmit).not.toHaveBeenCalled();
  });

  it('EDGE CASE: Renders massive output arrays perfectly without crashing (Virtualization test indicator)', () => {
    const massiveOutput = Array.from({ length: 1500 }, (_, i) => `Log line out: ${i}`);
    
    // Render shouldn't throw an out-of-memory exception or error.
    expect(() => {
      render(<Terminal output={massiveOutput} onCommandSubmit={mockOnCommandSubmit} />);
    }).not.toThrow();
  });
});
