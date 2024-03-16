import {View} from 'react-native';
import {GlobalStyles} from '../style/GlobalStyle';
import {IconButton, MD3Colors} from 'react-native-paper';
import {ThemeDark} from '../themes/ThemeDark';

interface Props {
  editAction?: boolean;
  onEdit?: Function;
  onDelete?: Function;
  onView?: Function;
  deleteAction?: boolean;
  viewAction?: boolean;
  editIcon: string;
  deleteIcon: string;
  viewIcon?: string;
}

function ActionContainer(props: Props): React.JSX.Element {
  return (
    <View style={[GlobalStyles.flex_row, GlobalStyles.align_right]}>
      {props?.viewAction && (
        <IconButton icon={props.viewIcon} size={20} onPress={props?.onView} />
      )}
      {props?.editAction && (
        <IconButton icon={props.editIcon} size={20} onPress={props?.onEdit} />
      )}
      {props?.deleteAction && (
        <IconButton
          icon={props.deleteIcon}
          iconColor={ThemeDark.colors.error}
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
  viewIcon: 'eye',
};

export default ActionContainer;
