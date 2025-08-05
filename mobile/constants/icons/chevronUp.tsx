import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ChevronUp = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-up-icon lucide-chevron-up"
    {...props}
  >
    <Path d="m18 15-6-6-6 6" />
  </Svg>
);
export default ChevronUp;
