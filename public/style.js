import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    dark: {
        backgroundColor: "#272727",
        container: {
            flex: 1,
            paddingHorizontal: 35,
            paddingVertical: 80,
            gap: 10,
            backgroundColor: "#272727",
            height: "100%"
        },
        headerText: {
            color: "white",
            fontSize: 32,
            fontWeight: "bold"
        },
        button: {
            width: 354, 
            height: 54,
            justifyContent: "center",
            alignItems: "center", 
            backgroundColor: "white",
            borderRadius: 10
        },
        buttonText: {
            color: "#272727",
            fontWeight: "bold",
            fontSize: 24
        }
        
    },
    light: {
        button: {
            width: 354, 
            height: 54,
            justifyContent: "center",
            alignItems: "center", 
            backgroundColor: "#272727",
            borderRadius: 10
        },
        buttonText: {
            color: "white",
            fontWeight: "bold",
            fontSize: 24
        }
    }
});