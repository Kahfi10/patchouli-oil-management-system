import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  isPositive?: boolean;
}

export const SparklineChart: React.FC<SparklineProps> = ({
  data,
  width = 90,
  height = 32,
  isPositive = true,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  // Apple clean solid stroke - zero fake gradients
  const strokeColor = isPositive ? '#248A3D' : '#FF3B30';

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};
