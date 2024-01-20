/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { ThemeDark } from '../../themes/ThemeDark';

interface Props extends React.PropsWithChildren {
  title: string,
  actions: Appbar.Action[]
}

function AppBar(props: Props): React.JSX.Element {

  return (
    <Appbar.Header style={{backgroundColor: ThemeDark.colors.background}} mode='small'>
        <Appbar.Content title={props.title}/>
        {props.children}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  
});

AppBar.defaultProps = {
  actions: []
}

export default AppBar;
