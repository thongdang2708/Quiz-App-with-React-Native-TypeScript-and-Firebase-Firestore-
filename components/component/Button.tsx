import {View, Text, Pressable, StyleSheet} from "react-native";

interface Props {
    children: React.ReactNode,
    onPress: () => void,
    style: any
}


function Button(props: Props) {
  return (
    <View style={styles.outerButtonContainer}>
    <Pressable onPress={props.onPress} android_ripple={{color: "#C5C5C5"}} style={({pressed}) => pressed && styles.pressedColor}>
    <View style={[styles.innerButtonContainer, props.style]}>
        <Text style={styles.textButton}> {props.children}</Text> 
    </View>
    </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    innerButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 2
    },
    outerButtonContainer: {
        marginHorizontal: 20,
        minWidth: 120
    },
    textButton: {
        fontWeight: "bold",
    },
    pressedColor: {
        opacity: 0.55
    }
});

export default Button