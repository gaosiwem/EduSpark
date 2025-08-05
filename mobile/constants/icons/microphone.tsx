import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";
const Microphone = ({ color = "#0C577D", size=24, ...props }: { color?: string, size?: number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-mic-icon lucide-mic"
    {...props}
  >
    <Path d="M12 19v3" />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <Rect x={9} y={2} width={6} height={13} rx={3} />
  </Svg>
);
export default Microphone;
