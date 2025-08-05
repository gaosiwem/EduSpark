import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const AIBot = ({ color = "#0C577D", size=24, ...props }: { color?: string, size?:number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-bot-icon lucide-bot"
    {...props}
  >
    <Path d="M12 8V4H8" />
    <Rect width={16} height={12} x={4} y={8} rx={2} />
    <Path d="M2 14h2" />
    <Path d="M20 14h2" />
    <Path d="M15 13v2" />
    <Path d="M9 13v2" />
  </Svg>
);
export default AIBot;
