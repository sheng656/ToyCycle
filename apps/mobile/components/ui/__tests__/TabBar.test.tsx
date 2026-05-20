import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

// Override reanimated mock at module level to avoid WorkletsError from NativeWorklets.
// The TabBar uses Animated.Text from react-native-reanimated for tab label animations.
jest.mock('react-native-reanimated', () => {
  const { Text, View } = require('react-native');
  return {
    __esModule: true,
    default: {
      Text,
      View,
      createAnimatedComponent: (component: any) => component,
      call: () => {},
    },
    useAnimatedStyle: jest.fn(() => ({})),
    useSharedValue: jest.fn((init: any) => ({ value: init })),
    withTiming: jest.fn((val: any) => val),
    withSpring: jest.fn((val: any) => val),
    Easing: { linear: (t: any) => t },
  };
});

import { TabBar } from '../TabBar';

// Build a minimal mock for BottomTabBarProps
function buildMockTabBarProps(activeIndex = 0, routes = ['Explore', 'Publish', 'Messages', 'Profile']) {
  const mockRoutes = routes.map((name, i) => ({
    key: `tab-${i}`,
    name,
    params: undefined,
  }));

  const descriptors = mockRoutes.reduce((acc, route) => {
    acc[route.key] = {
      options: {
        title: route.name,
        tabBarLabel: route.name,
        tabBarAccessibilityLabel: route.name,
      },
    };
    return acc;
  }, {} as any);

  const navigation = {
    emit: jest.fn().mockReturnValue({ defaultPrevented: false }),
    navigate: jest.fn(),
  } as any;

  return {
    state: {
      index: activeIndex,
      routes: mockRoutes,
    } as any,
    descriptors,
    navigation,
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
}

describe('TabBar component', () => {
  it('renders all tab labels', () => {
    render(<TabBar {...buildMockTabBarProps()} />);

    expect(screen.getByText('Explore')).toBeTruthy();
    expect(screen.getByText('Publish')).toBeTruthy();
    expect(screen.getByText('Messages')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('emits tabPress event when a tab is pressed', () => {
    const props = buildMockTabBarProps(0);
    render(<TabBar {...props} />);

    fireEvent.press(screen.getByText('Publish'));

    expect(props.navigation.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tabPress', target: 'tab-1' })
    );
  });

  it('navigates to the pressed tab when it is not the current focused tab', () => {
    const props = buildMockTabBarProps(0); // 'Explore' is active
    render(<TabBar {...props} />);

    fireEvent.press(screen.getByText('Messages'));

    expect(props.navigation.navigate).toHaveBeenCalledWith('Messages', undefined);
  });

  it('does not call navigate when pressing the already-focused tab', () => {
    const props = buildMockTabBarProps(0); // 'Explore' is the focused tab
    render(<TabBar {...props} />);

    fireEvent.press(screen.getByText('Explore'));

    // Since isFocused is true, navigation.navigate should not be called
    expect(props.navigation.navigate).not.toHaveBeenCalled();
  });

  it('sets accessibility role to button on each tab item', () => {
    render(<TabBar {...buildMockTabBarProps()} />);

    // There should be at least 4 buttons (one per tab), rendered accessibility elements may vary
    const buttons = screen.UNSAFE_getAllByProps({ accessibilityRole: 'button' });
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('marks exactly one tab with accessibilityState selected when focused', () => {
    const { toJSON } = render(<TabBar {...buildMockTabBarProps(2)} />); // Messages (index 2) is active

    // Recursively count nodes with accessibilityState.selected === true
    const countSelected = (node: any): number => {
      if (!node || typeof node !== 'object') return 0;
      const isSelf = node.props?.accessibilityState?.selected === true ? 1 : 0;
      const children = Array.isArray(node.children) ? node.children : [];
      return isSelf + children.reduce((acc: number, child: any) => acc + countSelected(child), 0);
    };

    expect(countSelected(toJSON())).toBe(1);
  });
});
