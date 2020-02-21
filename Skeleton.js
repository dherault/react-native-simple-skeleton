import React, { useRef, useEffect, useState } from 'react'
import { Animated, View } from 'react-native'
import { Svg, Rect, Defs, LinearGradient, Stop } from 'react-native-svg'
import PropTypes from 'prop-types'

function Skeleton({ speed, style, backgroundColor, foregroundColor }) {
  const viewRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [animatedValue] = useState(new Animated.Value(-1))
  const [offset, setOffset] = useState(-1)

  useEffect(() => {
    viewRef.current.measure((x, y, width, height) => {
      setDimensions({ width, height })

      animatedValue.addListener(({ value }) => {
        setOffset(value)
      })

      startAnimation()
    })
  }, [])

  function startAnimation() {
    const duration = speed * 1000

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start(() => {
      animatedValue.setValue(-1)
      startAnimation()
    })
  }

  const { width, height } = dimensions

  return (
    <View ref={viewRef} style={[{ flex: 1 }, style]}>
      <Svg viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="gradient" x1="-100%" y1={0} x2="300%" y2={0}>
            <Stop offset={offset - 1} stopColor={backgroundColor} />
            <Stop offset={offset} stopColor={foregroundColor} />
            <Stop offset={offset + 1} stopColor={backgroundColor} />
            <Stop offset={offset + 2} stopColor={foregroundColor} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width="100%" height="100%" fill="url(#gradient)" />
      </Svg>
    </View>
  )
}

Skeleton.propTypes = {
  speed: PropTypes.number,
  style: PropTypes.any,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string,
}

Skeleton.defaultProps = {
  speed: 1.6,
  backgroundColor: '#eee',
  foregroundColor: '#fff',
}

export default Skeleton
