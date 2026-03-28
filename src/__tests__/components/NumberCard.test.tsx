import React from 'react';
import { render } from '@testing-library/react-native';
import NumberCard from '../../components/game/NumberCard';

describe('NumberCard', () => {
  it('should render with number', () => {
    const { getByText } = render(
      <NumberCard number={5} />
    );
    
    expect(getByText('5')).toBeTruthy();
  });

  it('should render with different numbers', () => {
    const { getByText } = render(
      <NumberCard number={10} />
    );
    
    expect(getByText('10')).toBeTruthy();
  });

  it('should render as clicked', () => {
    const { getByText } = render(
      <NumberCard number={3} isClicked />
    );
    
    expect(getByText('3')).toBeTruthy();
  });

  it('should render as matched', () => {
    const { getByText } = render(
      <NumberCard number={7} isMatched />
    );
    
    expect(getByText('7')).toBeTruthy();
    expect(getByText('✓')).toBeTruthy();
  });

  it('should render as disabled', () => {
    const { getByText } = render(
      <NumberCard number={2} disabled />
    );
    
    expect(getByText('2')).toBeTruthy();
  });

  it('should have testID when provided', () => {
    const { getByTestId } = render(
      <NumberCard number={1} testID="number-card-1" />
    );
    
    expect(getByTestId('number-card-1')).toBeTruthy();
  });
});
