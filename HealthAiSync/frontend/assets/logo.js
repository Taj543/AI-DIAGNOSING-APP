import React from 'react';
import { Svg, Circle, Path, Text } from 'react-native-svg';
import { View } from 'react-native';
import { COLORS } from '../src/constants/theme';

const Logo = ({ width = 200, height = 200, showText = true }) => {
  const scale = width / 200; // Scale factor based on provided width
  
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 200 200">
        {/* Background Circle */}
        <Circle cx="100" cy="100" r="90" fill={COLORS.primary} />
        
        {/* Heart Shape */}
        <Path d="M100 150C85 135 55 110 55 80C55 55 75 40 100 70C125 40 145 55 145 80C145 110 115 135 100 150Z" fill="#FFFFFF" />
        
        {/* Brain Detail */}
        <Path d="M80 90C75 85 73 78 75 72C77 66 82 62 88 62C94 62 100 66 100 72M120 90C125 85 127 78 125 72C123 66 118 62 112 62C106 62 100 66 100 72" stroke={COLORS.secondary} strokeWidth="4" fill="none" />
        
        {/* Digital Circuit Lines */}
        <Path d="M40 100H60M140 100H160M100 40V60M100 140V160" stroke={COLORS.accent1} strokeWidth="3" />
        <Circle cx="60" cy="100" r="5" fill={COLORS.accent1} />
        <Circle cx="140" cy="100" r="5" fill={COLORS.accent1} />
        <Circle cx="100" cy="60" r="5" fill={COLORS.accent1} />
        <Circle cx="100" cy="140" r="5" fill={COLORS.accent1} />
        
        {/* Text */}
        {showText && (
          <Text 
            x="100" 
            y="190" 
            textAnchor="middle" 
            fontWeight="bold" 
            fontSize="20" 
            fill={COLORS.primary}
          >
            HealthAI
          </Text>
        )}
      </Svg>
    </View>
  );
};

export default Logo;