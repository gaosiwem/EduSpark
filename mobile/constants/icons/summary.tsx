import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const Summary = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-notepad-text-icon lucide-notepad-text"
    {...props}
  >
    <Path d="M8 2v4" />
    <Path d="M12 2v4" />
    <Path d="M16 2v4" />
    <Rect width={16} height={18} x={4} y={4} rx={2} />
    <Path d="M8 10h6" />
    <Path d="M8 14h8" />
    <Path d="M8 18h5" />
  </Svg>
);
export default Summary;
