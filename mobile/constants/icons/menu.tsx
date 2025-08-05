import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Menu = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-menu-icon lucide-menu"
    {...props}
  >
    <Path d="M4 12h16" />
    <Path d="M4 18h16" />
    <Path d="M4 6h16" />
  </Svg>
);
export default Menu