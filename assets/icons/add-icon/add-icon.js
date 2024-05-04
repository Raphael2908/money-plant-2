import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

function AddIcon(props) {
  return (
    <Svg
      width={22}
      height={23}
      viewBox="0 0 22 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G
        clipPath="url(#clip0_3_67)"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M11 1.286v20.428M.786 11.437h20.428" />
      </G>
      <Defs>
        <ClipPath id="clip0_3_67">
          <Path fill="#fff" transform="translate(0 .5)" d="M0 0H22V22H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default AddIcon
