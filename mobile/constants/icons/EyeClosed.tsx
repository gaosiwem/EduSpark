import * as React from "react";
import Svg, { Path } from "react-native-svg";
const EyeClosed = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-eye-closed-icon lucide-eye-closed"
    {...props}
  >
    <Path d="m15 18-.722-3.25" />
    <Path d="M2 8a10.645 10.645 0 0 0 20 0" />
    <Path d="m20 15-1.726-2.05" />
    <Path d="m4 15 1.726-2.05" />
    <Path d="m9 18 .722-3.25" />
  </Svg>
);
export default EyeClosed;