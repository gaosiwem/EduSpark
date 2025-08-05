import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CloudUpload = ({ color = "#0C577D", ...props }: { color?: string } & React.ComponentProps<typeof Svg>) => (
  <Svg
    width={30}
    height={30}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-cloud-upload-icon lucide-cloud-upload"
    {...props}
  >
    <Path d="M12 13v8" />
    <Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <Path d="m8 17 4-4 4 4" />
  </Svg>
);
export default CloudUpload;
