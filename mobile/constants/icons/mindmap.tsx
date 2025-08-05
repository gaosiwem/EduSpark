import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const MindMap = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-waypoints-icon lucide-waypoints"
    {...props}
  >
    <Circle cx={12} cy={4.5} r={2.5} />
    <Path d="m10.2 6.3-3.9 3.9" />
    <Circle cx={4.5} cy={12} r={2.5} />
    <Path d="M7 12h10" />
    <Circle cx={19.5} cy={12} r={2.5} />
    <Path d="m13.8 17.7 3.9-3.9" />
    <Circle cx={12} cy={19.5} r={2.5} />
  </Svg>
);
export default MindMap;
