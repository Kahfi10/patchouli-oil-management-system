import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Circle } from 'react-native-svg';
import { formatRupiah } from '../utils/formatters';
import { getAppleTheme, ThemeMode } from '../theme/colors';
import { SANS_FONT } from '../theme/typography';

export type TimeRange = '7D' | '30D' | '1Y';

interface ChartPoint {
  date: string;
  price: number;
}

interface InteractivePriceChartProps {
  basePrice: number;
  mode: ThemeMode;
  regionName: string;
}

// Generate realistic historical series for patchouli prices
const generateSeries = (base: number, range: TimeRange): ChartPoint[] => {
  if (range === '7D') {
    return [
      { date: '06 Okt', price: base - 50000 },
      { date: '07 Okt', price: base - 35000 },
      { date: '08 Okt', price: base - 30000 },
      { date: '09 Okt', price: base - 20000 },
      { date: '10 Okt', price: base - 10000 },
      { date: '11 Okt', price: base - 5000 },
      { date: '12 Okt (Hari ini)', price: base },
    ];
  }

  if (range === '30D') {
    return [
      { date: '12 Sep', price: base - 180000 },
      { date: '17 Sep', price: base - 150000 },
      { date: '22 Sep', price: base - 110000 },
      { date: '27 Sep', price: base - 95000 },
      { date: '02 Okt', price: base - 60000 },
      { date: '07 Okt', price: base - 30000 },
      { date: '12 Okt', price: base },
    ];
  }

  // 1Y range
  return [
    { date: 'Okt 25', price: base - 420000 },
    { date: 'Des 25', price: base - 380000 },
    { date: 'Feb 26', price: base - 290000 },
    { date: 'Apr 26', price: base - 190000 },
    { date: 'Jun 26', price: base - 110000 },
    { date: 'Agt 26', price: base - 60000 },
    { date: 'Okt 26', price: base },
  ];
};

export const InteractivePriceChart: React.FC<InteractivePriceChartProps> = ({
  basePrice,
  mode,
  regionName,
}) => {
  const theme = getAppleTheme(mode);
  const [range, setRange] = useState<TimeRange>('7D');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const points = generateSeries(basePrice, range);
  const activeIdx = selectedIndex !== null ? selectedIndex : points.length - 1;
  const activePoint = points[activeIdx];

  const minPrice = Math.min(...points.map((p) => p.price));
  const maxPrice = Math.max(...points.map((p) => p.price));
  const priceRange = maxPrice - minPrice || 1;

  const width = 320;
  const height = 130;
  const padTop = 14;
  const padBottom = 16;
  const plotH = height - padTop - padBottom;

  const coords = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = padTop + plotH - ((p.price - minPrice) / priceRange) * plotH;
    return { x, y };
  });

  const pathD = coords.reduce((acc, c, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`;
  }, '');

  const isUp = points[points.length - 1].price >= points[0].price;
  const strokeColor = isUp ? theme.accent : theme.danger;

  return (
    <View style={styles.container}>
      {/* Header Info: Selected Date and Price */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerLabel, { color: theme.textSecondary }]}>
            {activePoint.date} • {regionName}
          </Text>
          <Text style={[styles.activePrice, { color: theme.text }]}>
            {formatRupiah(activePoint.price)}
            <Text style={[styles.priceUnit, { color: theme.textSecondary }]}> / kg</Text>
          </Text>
        </View>

        {/* Range Segmented Control */}
        <View style={[styles.rangePills, { backgroundColor: theme.surfaceSecondary }]}>
          {(['7D', '30D', '1Y'] as TimeRange[]).map((r) => {
            const isSel = range === r;
            return (
              <TouchableOpacity
                key={r}
                onPress={() => {
                  setRange(r);
                  setSelectedIndex(null);
                }}
                style={[
                  styles.rangeBtn,
                  isSel && [styles.rangeBtnActive, { backgroundColor: theme.surface }],
                ]}
              >
                <Text
                  style={[
                    styles.rangeText,
                    { color: isSel ? theme.text : theme.textSecondary },
                    isSel && { fontWeight: '700' },
                  ]}
                >
                  {r}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SVG Chart with Grid Lines */}
      <View style={styles.chartWrapper}>
        <Svg width={width} height={height}>
          {/* Subtle Grid Dividers */}
          <Line x1="0" y1={padTop} x2={width} y2={padTop} stroke={theme.border} strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="0" y1={padTop + plotH / 2} x2={width} y2={padTop + plotH / 2} stroke={theme.border} strokeWidth="1" strokeDasharray="3 3" />
          <Line x1="0" y1={padTop + plotH} x2={width} y2={padTop + plotH} stroke={theme.border} strokeWidth="1" />

          {/* Main Price Line */}
          <Path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Tap Indicator Point */}
          {coords[activeIdx] && (
            <>
              <Line
                x1={coords[activeIdx].x}
                y1={padTop}
                x2={coords[activeIdx].x}
                y2={padTop + plotH}
                stroke={theme.borderStrong}
                strokeWidth="1"
              />
              <Circle
                cx={coords[activeIdx].x}
                cy={coords[activeIdx].y}
                r="5"
                fill={strokeColor}
                stroke={theme.surface}
                strokeWidth="2"
              />
            </>
          )}
        </Svg>
      </View>

      {/* Touch Point Selectors Bar */}
      <View style={styles.pointsBar}>
        {points.map((p, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedIndex(idx)}
            style={[
              styles.touchZone,
              activeIdx === idx && [styles.touchZoneActive, { backgroundColor: theme.surfaceSecondary }],
            ]}
          >
            <Text
              style={[
                styles.pointDateText,
                { color: activeIdx === idx ? theme.text : theme.textTertiary },
                activeIdx === idx && { fontWeight: '700' },
              ]}
              numberOfLines={1}
            >
              {p.date.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerLabel: {
    fontFamily: SANS_FONT,
    fontSize: 11,
    marginBottom: 2,
  },
  activePrice: {
    fontFamily: SANS_FONT,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: '400',
  },
  rangePills: {
    flexDirection: 'row',
    borderRadius: 7,
    padding: 2,
  },
  rangeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  rangeBtnActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  rangeText: {
    fontFamily: SANS_FONT,
    fontSize: 10,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  pointsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  touchZone: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
  },
  touchZoneActive: {
    borderRadius: 4,
  },
  pointDateText: {
    fontFamily: SANS_FONT,
    fontSize: 9,
  },
});
