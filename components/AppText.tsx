import React from "react";
import { Text, TextProps } from "react-native";
import { useApp } from "@/context/AppContext";
import { FONTS } from "@/constants/theme";

type Variant = "serif" | "serifBold" | "sans" | "sansBold" | "sansExtraBold";

interface Props extends TextProps {
  variant?: Variant;
  size?: number;
  color?: string;
  dim?: boolean;
}

const FAMILY: Record<Variant, string> = {
  serif: FONTS.serifSemibold,
  serifBold: FONTS.serifBold,
  sans: FONTS.sansRegular,
  sansBold: FONTS.sansBold,
  sansExtraBold: FONTS.sansExtraBold,
};

export function AppText({ variant = "sans", size = 15, color, dim, style, ...rest }: Props) {
  const { palette } = useApp();
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: FAMILY[variant], fontSize: size, color: color ?? (dim ? palette.textDim : palette.text) },
        style,
      ]}
    />
  );
}
