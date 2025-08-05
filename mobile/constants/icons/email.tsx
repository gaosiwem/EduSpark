import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const Email = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <Rect x={2} y={4} width={20} height={16} rx={2} />
  </Svg>
);
export default Email;