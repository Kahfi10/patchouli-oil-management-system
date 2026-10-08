#!/usr/bin/env python3
"""
UI App Developer Skill - Accessibility & Color Contrast Validator
Calculates relative luminance and WCAG 2.2 contrast ratio between colors.
"""

import sys
import re

def parse_hex_color(hex_str: str):
    hex_clean = hex_str.strip().lstrip('#')
    if len(hex_clean) == 3:
        hex_clean = ''.join([c * 2 for c in hex_clean])
    if len(hex_clean) != 6:
        raise ValueError(f"Invalid hex color format: {hex_str}")
    return tuple(int(hex_clean[i:i+2], 16) for i in (0, 2, 4))

def calculate_channel_luminance(channel_val: int) -> float:
    c = channel_val / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def get_relative_luminance(rgb_tuple) -> float:
    r, g, b = rgb_tuple
    return (
        0.2126 * calculate_channel_luminance(r) +
        0.7152 * calculate_channel_luminance(g) +
        0.0722 * calculate_channel_luminance(b)
    )

def calculate_contrast_ratio(hex_fg: str, hex_bg: str) -> float:
    rgb1 = parse_hex_color(hex_fg)
    rgb2 = parse_hex_color(hex_bg)
    l1 = get_relative_luminance(rgb1)
    l2 = get_relative_luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

def audit_pair(fg: str, bg: str, label: str = ""):
    ratio = calculate_contrast_ratio(fg, bg)
    passes_normal = ratio >= 4.5
    passes_large = ratio >= 3.0
    status = "[PASS]" if passes_normal else ("[PASS LARGE]" if passes_large else "[FAIL]")
    desc = f" ({label})" if label else ""
    print(f"{status} Ratio {ratio:5.2f}:1 | FG: {fg} on BG: {bg}{desc}")
    return passes_normal

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        fg_input = sys.argv[1]
        bg_input = sys.argv[2]
        ratio = calculate_contrast_ratio(fg_input, bg_input)
        print(f"Contrast Ratio: {ratio:.2f}:1")
        print(f"WCAG AA Normal Text (>=4.5): {'PASS' if ratio >= 4.5 else 'FAIL'}")
        print(f"WCAG AA Large Text  (>=3.0): {'PASS' if ratio >= 3.0 else 'FAIL'}")
    else:
        print("Auditing UI Theme Contrast Standards:")
        print("-" * 50)
        # Default theme check
        audit_pair("#F8FAFC", "#090D16", "Primary Text on Canvas")
        audit_pair("#94A3B8", "#090D16", "Secondary Text on Canvas")
        audit_pair("#64748B", "#090D16", "Muted Text on Canvas")
        audit_pair("#FFFFFF", "#6366F1", "White Text on Primary Button")
        audit_pair("#6366F1", "#090D16", "Primary Accent on Canvas")
        print("-" * 50)
        print("Usage: python verify_a11y_contrast.py <#foreground> <#background>")
