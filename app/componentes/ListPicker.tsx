import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  TextInput,
  Divider,
  Text,
  List,
} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {CONTAINER_PADDING} from '../constants/GlobalConstants';
import {ThemeDark} from '../themes/ThemeDark';
import {ScrollView} from 'react-native-gesture-handler';
import UserListView from '../views/users/UserListView';

type Props = {
  inputTitle: string;
  onSelect: Function;
  listIcon: string;
  options: {title: string; value: any}[];
};

function ListPicker(
  {inputTitle, onSelect, listIcon, options}: Props,
  ref: React.Ref<any>,
): React.JSX.Element {
  const [visible, setVisible] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    present() {
      setVisible(true);
    },
    close() {
      setVisible(false);
    },
  }));

  function cancelModal() {
    setVisible(false);
  }

  function select(value: any) {
    onSelect(value);
    cancelModal();
  }

  return (
    <Dialog visible={visible} onDismiss={cancelModal} style={styles.modal}>
      <Dialog.Title style={{}}>{inputTitle}</Dialog.Title>
      <Dialog.Content>
        <View style={{height: '95%'}}>
          <ScrollView>
            {options.map((option, index) => {
              return (
                <View key={option.title + index}>
                  <List.Item
                    onPress={() => select(option.value)}
                    left={() => <List.Icon icon={listIcon} />}
                    key={option.value._id.toString()}
                    style={{paddingRight: 0}}
                    title={option.title}
                  />
                  <Divider style={{marginBottom: 20, marginTop: 20}} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Dialog.Content>
    </Dialog>
  );
}
export default React.forwardRef(ListPicker);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 2 * CONTAINER_PADDING,
  },
  button: {
    marginTop: CONTAINER_PADDING,
    width: '44%',
  },
  inputContainer: {
    marginBottom: CONTAINER_PADDING * 2,
    width: '100%',
  },
  section: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  notesContainer: {
    flex: 1,
    width: '98%',
    backgroundColor: '#ffe57f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'black',
    padding: CONTAINER_PADDING,
    paddingTop: CONTAINER_PADDING,
  },
  modal: {
    alignSelf: 'center',
    position: 'absolute',
    top: CONTAINER_PADDING,
    left: CONTAINER_PADDING,
    right: CONTAINER_PADDING,
    bottom: CONTAINER_PADDING,
    height: '95%',
    display: 'flex',
  },
});
