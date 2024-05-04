import * as React from "react"
import Svg, { Path } from "react-native-svg"

function ArrowIcon(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M15.707 8.707a1 1 0 000-1.414L9.343.929A1 1 0 007.93 2.343L13.586 8l-5.657 5.657a1 1 0 101.414 1.414l6.364-6.364zM0 9h15V7H0v2z"
        fill="#fff"
      />
    </Svg>
  )
}

export default ArrowIcon
