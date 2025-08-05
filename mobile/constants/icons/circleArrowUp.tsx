import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const CircleArrowUp = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={40}
    height={40}
    viewBox="0 0 24 24"
    fill={color}
    stroke='#ffffff'
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-circle-arrow-up-icon lucide-circle-arrow-up"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m16 12-4-4-4 4" />
    <Path d="M12 16V8" />
  </Svg>
);
export default CircleArrowUp;
