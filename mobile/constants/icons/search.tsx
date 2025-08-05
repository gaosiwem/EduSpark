import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
const Search  = ({ color = "#0C577D", size=21, ...props }: { color?: string, size?: number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-globe-icon lucide-globe"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <Path d="M2 12h20" />
  </Svg>
);
export default Search;
