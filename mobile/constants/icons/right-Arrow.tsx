import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const RightArrow = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    viewBox="0 0 24 24"
    fill="#ffffff"
    stroke="#0C577D"
    strokeWidth={1.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-circle-arrow-right-icon lucide-circle-arrow-right"
    {...props}
  >
    <Circle cx={12} cy={12} r={10} />
    <Path d="m12 16 4-4-4-4" />
    <Path d="M8 12h8" />
  </Svg>
);
export default RightArrow;