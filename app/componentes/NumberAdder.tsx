import React from "react"
import { StyleSheet, View } from "react-native";
import { CONTAINER_PADDING } from "../constants/GlobalConstants";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { ThemeDark } from "../themes/ThemeDark";

type Props = {
    initialValue: number,
    label: string;
    onUpdate?: any
}

export function NumberAdder({label, initialValue, onUpdate}: Props, ref: React.Ref<any>): React.JSX.Element {

    const { t } = useTranslation();
    const [state, setState] = React.useState<number | string>(initialValue);
    const [isHolding, setIsHolding] = React.useState<number>(0);


    React.useEffect(() => {
        let intervalId: any;
    
        if (isHolding != 0) {
            intervalId = setInterval(() => {
                if(typeof state === 'number'){
                    setState(state => (state as number) + isHolding);
                }
                }, 150);   
        } else {
          clearInterval(intervalId);
          onUpdate != undefined && onUpdate();
        }
    
        return () => clearInterval(intervalId);
      }, [isHolding]);

    React.useImperativeHandle(ref, () => ({
        getState(){
          return state;
        }
       }));

    function update(negative = false){
        if((typeof state === 'number')){
            if(negative && state > 0){
                setState(state - 1);
            } else if(!negative){
                setState(state + 1)
            }
        }
        onUpdate != undefined && onUpdate();
    }


    return (
        <View style={{width: '50%',justifyContent: 'space-between'}}>
            <Text
                variant="labelSmall"
            >
            {label}
            </Text>
            <View style={{display: 'flex', flexDirection: 'row', marginTop: 10}}>
                    <IconButton  icon={'arrow-down'}
                                style={styles.button}
                                 size={28}
                                 onTouchStart={() => {setIsHolding(-1)}}
                                 onTouchEnd={() => {setIsHolding(0)}}
                                 onPress={() => (update(true))}
                                  />
                    <TextInput  style={styles.inputContainer}
                                keyboardType="decimal-pad"
                                value={state + ''}
                                onChangeText={(val) => setState(val?.trim()?.length > 0 ? parseInt(val) : '')}
                    />
                    <IconButton  icon={'arrow-up'}
                                 style={styles.button}
                                 size={28}
                                 onTouchStart={() => {setIsHolding(1)}}
                                 onTouchEnd={() => {setIsHolding(0)}}
                                 onPress={() => (update())}

                                />
            </View>
        </View>
    )

}

export default React.forwardRef(NumberAdder);

const styles = StyleSheet.create({
    inputContainer: {
     marginBottom: CONTAINER_PADDING,
     textAlign: 'center',
     fontWeight: 'bold',
     
    },
    button: {
        backgroundColor: ThemeDark.colors.elevation.level4,
        
    }
  });
  