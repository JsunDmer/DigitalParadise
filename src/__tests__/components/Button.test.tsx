import React from 'react';
import { render } from '@testing-library/react-native';
import Button from '../../components/ui/Button';

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should render with primary variant by default', () => {
    const { getByText } = render(
      <Button title="Primary" onPress={() => {}} />
    );
    
    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary" onPress={() => {}} variant="secondary" />
    );
    
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(
      <Button title="Outline" onPress={() => {}} variant="outline" />
    );
    
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should render with small size', () => {
    const { getByText } = render(
      <Button title="Small" onPress={() => {}} size="small" />
    );
    
    expect(getByText('Small')).toBeTruthy();
  });

  it('should render with large size', () => {
    const { getByText } = render(
      <Button title="Large" onPress={() => {}} size="large" />
    );
    
    expect(getByText('Large')).toBeTruthy();
  });

  it('should render as disabled', () => {
    const { getByText } = render(
      <Button title="Disabled" onPress={() => {}} disabled />
    );
    
    expect(getByText('Disabled')).toBeTruthy();
  });
});
