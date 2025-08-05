import * as React from "react";
import Svg, { Path } from "react-native-svg";
const LogOut = ({ color = "#0C577D", size=24, ...props }: { color?: string, size?: number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-log-out-icon lucide-log-out"
    {...props}
  >
    <Path d="m16 17 5-5-5-5" />
    <Path d="M21 12H9" />
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  </Svg>
);
export default LogOut;
