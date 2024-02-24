import {View} from 'react-native';
import {GlobalStyles} from '../style/GlobalStyle';
import {IconButton, MD3Colors} from 'react-native-paper';

interface Props {
  editAction?: boolean;
  onEdit?: Function;
  onDelete?: Function;
  deleteAction?: boolean;
  editIcon: string;
  deleteIcon: string;
}

function ActionContainer(props: Props): React.JSX.Element {
  return (
    <View style={[GlobalStyles.flex_row, GlobalStyles.align_right]}>
      {props?.editAction && (
        <IconButton icon={props.editIcon} size={20} onPress={props?.onEdit} />
      )}
      {props?.deleteAction && (
        <IconButton
          icon={props.deleteIcon}
          iconColor={MD3Colors.error30}
          size={20}
          onPress={props?.onDelete}
        />
      )}
    </View>
  );
}
ActionContainer.defaultProps = {
  editIcon: 'circle-edit-outline',
  deleteIcon: 'delete',
};

export default ActionContainer;
