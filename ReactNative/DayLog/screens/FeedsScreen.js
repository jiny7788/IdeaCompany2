import React, { useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import FloatingWriteButton from "../components/FloatingWriteButton";
import LogContext from "../contexts/LogContext";

function FeedsScreen() {
    const {text, setText} = useContext(LogContext);
    return (
        <View style={styles.block}>
            <FloatingWriteButton />
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        flex: 1,
    },
});

export default FeedsScreen;