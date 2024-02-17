import React from "react"
import { StyleSheet, View } from "react-native";
import { CONTAINER_PADDING } from "../constants/GlobalConstants";
import { Button, Chip, IconButton, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ThemeDark } from "../themes/ThemeDark";

interface Item {
    icon?: string,
    title?: string,
    value: any
}

type Props = {
    initialValue: any,
    onUpdate?: any,
    items: Item[]
}

function ChipPicker({items, initialValue, onUpdate}: Props, ref: React.Ref<any>): React.JSX.Element {

  
    const [state, setState] = React.useState<any>(initialValue);
    const [isHolding, setIsHolding] = React.useState<number>(0);

    React.useImperativeHandle(ref, () => ({
        getState(){
          return state;
        }
       }));

    function select(item: any){
        setState(item);
    }


    return (
        <View style={{width: '100%', display: 'flex', flexDirection: 'row', marginBottom: 15, flexWrap: 'wrap'}}>
          {items.map(item => <Chip key={item.value} 
                                   style={[styles.both, state === item.value ? styles.selected : styles.normal]} 
                                   icon={item?.icon} 
                                   onPress={() => {select(item.value)}}>{item?.title}</Chip>)}
        </View>
    )

}

export default React.forwardRef(ChipPicker);

const styles = StyleSheet.create({
    both: {
        marginRight: 10,
        marginTop: 10
    },
    selected: {
        borderWidth: 1,
        borderColor: 'white'
    },
    normal: {}
  });
  