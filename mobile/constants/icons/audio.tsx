import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Audio = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-audio-lines-icon lucide-audio-lines"
    {...props}
  >
    <Path d="M2 10v3" />
    <Path d="M6 6v11" />
    <Path d="M10 3v18" />
    <Path d="M14 8v7" />
    <Path d="M18 5v13" />
    <Path d="M22 10v3" />
  </Svg>
);
export default Audio;
