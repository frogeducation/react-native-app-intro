import assign from 'assign-deep';
import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import DoneButton from './components/DoneButton';
import SkipButton from './components/SkipButton';
import RenderDots from './components/Dots';

const windowsWidth = Dimensions.get('window').width;
const windowsHeight = Dimensions.get('window').height;

const defaultStyles = {
  header: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pic: {
    width: 150,
    height: 150,
  },
  info: {
    flex: 0.5,
    alignItems: 'center',
    padding: 30,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    paddingBottom: 20,
  },
  description: {
    color: '#fff',
    fontSize: 20,
  },
  controllText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 13,
    height: 13,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dotContainer: {
    flex: 0.6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  nextButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  full: {
    height: 80,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export default class AppIntro extends Component {
  constructor(props) {
    super(props);

    this.styles = StyleSheet.create(assign({}, defaultStyles, props.customStyles));

    this.state = {
      skipFadeOpacity: new Animated.Value(1),
      doneFadeOpacity: new Animated.Value(0),
      nextOpacity: new Animated.Value(1),
      parallax: new Animated.Value(0),
    };
  }

  onNextBtnClick = (context) => {
    context.scrollTo(context.state.index + 1);
  }

  setDoneBtnOpacity = (value) => {
    Animated.timing(
      this.state.doneFadeOpacity,
      { toValue: value },
    ).start();
  }

  setSkipBtnOpacity = (value) => {
    Animated.timing(
      this.state.skipFadeOpacity,
      { toValue: value },
    ).start();
  }

  setNextOpacity = (value) => {
    Animated.timing(
      this.state.nextOpacity,
      { toValue: value },
    ).start();
  }
  getTransform = (index, offset, level) => {
    const isFirstPage = index === 0;
    const statRange = isFirstPage ? 0 : windowsWidth * (index - 1);
    const endRange = isFirstPage ? windowsWidth : windowsWidth * index;
    const startOpacity = isFirstPage ? 1 : 0;
    const endOpacity = isFirstPage ? 1 : 1;
    const leftPosition = isFirstPage ? 0 : windowsWidth / 3;
    const rightPosition = isFirstPage ? -windowsWidth / 3 : 0;
    const transform = [{
      transform: [
        {
          translateX: this.state.parallax.interpolate({
            inputRange: [statRange, endRange],
            outputRange: [
              isFirstPage ? leftPosition : leftPosition - (offset * level),
              isFirstPage ? rightPosition + (offset * level) : rightPosition,
            ],
          }),
        }],
    }, {
      opacity: this.state.parallax.interpolate({
        inputRange: [statRange, endRange], outputRange: [startOpacity, endOpacity],
      }),
    }];
    return {
      transform,
    };
  }

  renderPagination = (index, total, context) => {
    let isDoneBtnShow;
    let isSkipBtnShow;
    if (index === total - 1) {
      this.setDoneBtnOpacity(1);
      this.setSkipBtnOpacity(0);
      this.setNextOpacity(0);
      isDoneBtnShow = true;
      isSkipBtnShow = false;
    } else {
      this.setDoneBtnOpacity(0);
      this.setSkipBtnOpacity(1);
      this.setNextOpacity(1);
      isDoneBtnShow = false;
      isSkipBtnShow = true;
    }
    return (
      <View style={[this.styles.paginationContainer]}>
        {this.props.showSkipButton ? <SkipButton
          {...this.props}
          {...this.state}
          isSkipBtnShow={isSkipBtnShow}
          styles={this.styles}
          onSkipBtnClick={() => this.props.onSkipBtnClick(index)} /> :
          <View style={this.styles.btnContainer} />
        }
        {this.props.showDots && RenderDots(index, total, {
          ...this.props,
          styles: this.styles
        })}
        {this.props.showDoneButton ? <DoneButton
            {...this.props}
            {...this.state}
            isDoneBtnShow={isDoneBtnShow}
            styles={this.styles}
            onNextBtnClick={this.onNextBtnClick.bind(this, context)}
            onDoneBtnClick={this.props.onDoneBtnClick} /> :
            <View style={this.styles.btnContainer} />
          }
      </View>
    );
  }

  renderBasicSlidePage = (index, {
    title,
    description,
    img,
    imgStyle,
    backgroundColor,
    fontColor,
    level,
  }) => {
    const AnimatedStyle1 = this.getTransform(index, 10, level);
    const AnimatedStyle2 = this.getTransform(index, 0, level);
    const AnimatedStyle3 = this.getTransform(index, 15, level);
    const imgSource = (typeof img === 'string') ? {uri: img} : img;
    return (
      <View style={[this.styles.slide, { backgroundColor }]} showsPagination={false} key={index}>
        <Animated.View style={[this.styles.header, ...AnimatedStyle1.transform]}>
          <Image style={imgStyle} source={imgSource} />
        </Animated.View>
        <View style={this.styles.info}>
          <Animated.View style={AnimatedStyle2.transform}>
            <Text style={[this.styles.title, { color: fontColor }]}>{title}</Text>
          </Animated.View>
          <Animated.View style={AnimatedStyle3.transform}>
            <Text style={[this.styles.description, { color: fontColor }]}>{description}</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  renderChild = (children, pageIndex, index) => {
    const level = children.props.level || 0;
    const { transform } = this.getTransform(pageIndex, 10, level);
    const root = children.props.children;
    let nodes = children;
    if (Array.isArray(root)) {
      nodes = root.map((node, i) => this.renderChild(node, pageIndex, `${index}_${i}`));
    }
    let animatedChild = children;
    if (level !== 0) {
      animatedChild = (
        <Animated.View key={index} style={[children.props.style, transform]}>
          {nodes}
        </Animated.View>
      );
    } else {
      animatedChild = (
        <View key={index} style={children.props.style}>
          {nodes}
        </View>
      );
    }
    return animatedChild;
  }

  shadeStatusBarColor(color, percent) {
    const first = parseInt(color.slice(1), 16);
    const black = first & 0x0000FF;
    const green = first >> 8 & 0x00FF;
    const percentage = percent < 0 ? percent * -1 : percent;
    const red = first >> 16;
    const theme = percent < 0 ? 0 : 255;
    const finalColor = (0x1000000 + (Math.round((theme - red) * percentage) + red) * 0x10000 + (Math.round((theme - green) * percentage) + green) * 0x100 + (Math.round((theme - black) * percentage) + black)).toString(16).slice(1);

    return `#${finalColor}`;
  }

  isToTintStatusBar() {
    return this.props.pageArray && this.props.pageArray.length > 0 && Platform.OS === 'android'
  }

  render() {
    const childrens = this.props.children;
    const { pageArray } = this.props;
    let pages = [];
    let androidPages = null;
    if (pageArray.length > 0) {
      pages = pageArray.map((page, i) => this.renderBasicSlidePage(i, page));
    } else {
      pages = childrens.map((child, i) => this.renderChild(child, i, i));
    }

    if (this.isToTintStatusBar()) {
      StatusBar.setBackgroundColor(this.shadeStatusBarColor(this.props.pageArray[0].backgroundColor, -0.3), false);
    }

    return (
      <View style={{ width: '100%', height: '100%' }}>
        <Swiper
          loop={false}
          index={this.props.defaultIndex}
          renderPagination={this.renderPagination}
          onMomentumScrollEnd={(e, state) => {
            if (this.isToTintStatusBar()) {
              StatusBar.setBackgroundColor(this.shadeStatusBarColor(this.props.pageArray[state.index].backgroundColor, -0.3), false);
            }

            this.props.onSlideChange(state.index, state.total);
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: {  x: this.state.parallax } } }]
          )}
        >
          {pages}
        </Swiper>
      </View>
    );
  }
}

AppIntro.defaultProps = {
  dotColor: 'rgba(255,255,255,.3)',
  activeDotColor: '#fff',
  rightTextColor: '#fff',
  leftTextColor: '#fff',
  pageArray: [],
  onSlideChange: () => {},
  onSkipBtnClick: () => {},
  onDoneBtnClick: () => {},
  onNextBtnClick: () => {},
  doneBtnLabel: 'Done',
  skipBtnLabel: 'Skip',
  nextBtnLabel: '›',
  defaultIndex: 0,
  showSkipButton: true,
  showDoneButton: true,
  showDots: true
};
