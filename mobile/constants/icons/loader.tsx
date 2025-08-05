import * as React from "react";
import Svg, { Path } from "react-native-svg";

const Loader = ({ color = "#0C577D", size=24, ...props }: { color?: string, size?:number } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-loader-circle-icon lucide-loader-circle"
    {...props}
  >
    <Path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </Svg>
);
export default Loader;
