import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

describe('Avatar component', () => {
  it('renders without crashing with a remote URL', () => {
    const { toJSON } = render(<Avatar url="https://example.com/avatar.jpg" size={48} />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders without crashing when url is null (falls back to placeholder)', () => {
    const { toJSON } = render(<Avatar url={null} size={48} />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders without crashing when url is undefined (falls back to placeholder)', () => {
    const { toJSON } = render(<Avatar size={48} />);
    expect(toJSON()).not.toBeNull();
  });

  it('applies correct width and height for custom size prop', () => {
    const { toJSON } = render(<Avatar url="https://example.com/img.jpg" size={80} />);
    const json = toJSON() as any;

    // The outer View has a flattened style array: [containerStyle, { width, height, borderRadius }, customStyle]
    // We inspect the JSON to find our View with width:80
    const outerStyle = json.props.style;
    // Style array may be nested; check that one of the style entries has width: 80
    const hasWidth80 = (style: any): boolean => {
      if (!style) return false;
      if (Array.isArray(style)) return style.some(hasWidth80);
      if (typeof style === 'object') return style.width === 80;
      return false;
    };
    expect(hasWidth80(outerStyle)).toBe(true);
  });

  it('applies default size of 48 when size prop is not provided', () => {
    const { toJSON } = render(<Avatar url="https://example.com/img.jpg" />);
    const json = toJSON() as any;

    const outerStyle = json.props.style;
    const hasWidth48 = (style: any): boolean => {
      if (!style) return false;
      if (Array.isArray(style)) return style.some(hasWidth48);
      if (typeof style === 'object') return style.width === 48;
      return false;
    };
    expect(hasWidth48(outerStyle)).toBe(true);
  });

  it('uses the provided uri as image source when url is a string', () => {
    const testUrl = 'https://example.com/avatar.jpg';
    const { toJSON } = render(<Avatar url={testUrl} size={48} />);
    const json = toJSON() as any;

    // React Native Image normalizes the source prop into an array of source descriptors.
    // The Image child is the first (and only) child of the outer View.
    const imageChild = json.children[0];
    const source = imageChild.props.source;
    // source may be either { uri } or [{ uri }] depending on RN version
    const normalizedSource = Array.isArray(source) ? source[0] : source;
    expect(normalizedSource).toEqual({ uri: testUrl });
  });

});
