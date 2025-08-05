import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Document = ({ color = "#0C577D", size=24, ...props }: { color?: string, size?: number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-file-text-icon lucide-file-text"
    {...props}
  >
    <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <Path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <Path d="M10 9H8" />
    <Path d="M16 13H8" />
    <Path d="M16 17H8" />
  </Svg>
);
export default Document;
