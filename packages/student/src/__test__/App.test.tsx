import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import App from '../App';

describe('Student App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});
