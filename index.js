'use strict';

import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Animated } from 'react-native';

var FloatingLabel = React.createClass({
  getInitialState: function() {
    var initialPadding = 9;
    var initialOpacity = 0;

    if (this.props.visible) {
      initialPadding = 5
      initialOpacity = 1
    }

    return {
      paddingAnim: new Animated.Value(initialPadding),
      opacityAnim: new Animated.Value(initialOpacity)
    };
  },

  componentWillReceiveProps: function(newProps) {
    Animated.timing(this.state.paddingAnim, {
      toValue: newProps.visible ? 5 : 9,
      duration: 230
    }).start();

    return Animated.timing(this.state.opacityAnim, {
      toValue: newProps.visible ? 1 : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={[styles.floatingLabel, {paddingTop: this.state.paddingAnim, opacity: this.state.opacityAnim}]}>
        {this.props.children}
      </Animated.View>
    );
  }
});

const fieldMargin = 17

var TextFieldHolder = React.createClass({
  getInitialState: function() {
    return {
      marginAnim: new Animated.Value(this.props.withValue ? fieldMargin : 0)
    };
  },

  componentWillReceiveProps: function(newProps) {
    return Animated.timing(this.state.marginAnim, {
      toValue: newProps.withValue ? fieldMargin : 0,
      duration: 230
    }).start();
  },

  render: function() {
    return(
      <Animated.View style={{marginTop: this.state.marginAnim}}>
        {this.props.children}
      </Animated.View>
    );
  }
});

var FloatLabelTextField = React.createClass({
  getInitialState: function() {
    return {
      focussed: false,
      text: this.props.value,
      placeHolder: this.props.placeHolder,
    };
  },

  componentDidMount: function() {
    if( !! this.props.focus )
      setTimeout(() => {
        this.refs.input.focus()
      }, 500 )
  },

  withBorder: function() {
    if (!this.props.noBorder) {
      return styles.withBorder;
    };
  },

  render: function() {
    return(
      <View style={styles.container}>
        <View style={styles.viewContainer}>
          <View style={styles.paddingView}></View>
          <View style={[styles.fieldContainer, this.withBorder()]}>
            <FloatingLabel visible={this.state.text}>
              <Text style={[styles.fieldLabel, this.labelStyle()]}
                onPress={this.setFocus}>{this.placeHolderValue()}</Text>
            </FloatingLabel>
            <TextFieldHolder withValue={this.state.text}>
              <TextInput
                ref='input'
                placeholder={this.state.placeHolder}
                style={[styles.valueText, this.props.inputStyle]}
                value={this.state.text}
                onFocus={this.setFocus}
                onBlur={this.unsetFocus}
                onChangeText={this.setText}
                secureTextEntry={this.props.secureTextEntry}
                enablesReturnKeyAutomatically={this.props.enablesReturnKeyAutomatically}
                returnKeyType={this.props.returnKeyType}
                keyboardType={this.props.keyboardType}
              />
            </TextFieldHolder>
          </View>
        </View>
      </View>
    );
  },

  focus: function() {
    this.refs.input.focus()
  },

  setFocus: function() {
    this.setState({
      focussed: true
    });
    try {
      return this.props.onFocus();
    } catch (_error) {}
  },

  unsetFocus: function() {
    this.setState({
      focussed: false
    });
    try {
      return this.props.onBlur();
    } catch (_error) {}
  },

  labelStyle: function() {
    if (this.state.focussed)
      return [ styles.focussed, this.props.labelFocusStyle ]
    else
      return this.props.labelStyle
  },

  placeHolderValue: function() {
    if (this.state.text) {
      return this.state.placeHolder;
    }
  },

  setText: function(value) {
    this.setState({
      text: value
    });
    try {
      return this.props.onChangeTextValue(value);
    } catch (_error) {}
  },

  setPlaceHolder: function(value) {
    this.setState({
      placeHolder: value
    });
  },

  withMargin: function() {
    if (this.state.text) {
      return styles.withMargin;
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 48,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  paddingView: {
    width: 15,
  },
  floatingLabel: {
    paddingTop: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  fieldLabel: {
    height: 15,
    fontSize: 12,
    letterSpacing: -0.45,
    color: '#B1B1B1'
  },
  fieldContainer: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative'
  },
  withBorder: {
    borderBottomWidth: 1 / 2,
    borderColor: '#C8C7CC',
  },
  valueText: {
    height: 30,
    // fontSize: 16,
    // color: '#111111',
  },
  withMargin: {
    marginTop: 10,
  },
  focussed: {
    color: "#1482fe",
  }
});

module.exports = FloatLabelTextField
