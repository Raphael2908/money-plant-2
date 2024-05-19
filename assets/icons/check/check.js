import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Check(props) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.5 8.55l2.73 3.51a1 1 0 001.56.03L13.5 1.55"
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Check
