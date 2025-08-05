import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Chat = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-message-circle-icon lucide-message-circle"
    {...props}
  >
    <Path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Svg>
);
export default Chat;
