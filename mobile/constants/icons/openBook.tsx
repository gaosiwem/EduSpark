import * as React from "react";
import Svg, { Path } from "react-native-svg";
const OpenBook = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-book-open-check-icon lucide-book-open-check"
    {...props}
  >
    <Path d="M12 21V7" />
    <Path d="m16 12 2 2 4-4" />
    <Path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" />
  </Svg>
);
export default OpenBook;
