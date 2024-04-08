import React, {useEffect, useState} from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
interface ConfirmModalProps {
    title: string;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
    showConfirm: boolean;
}
const ConfirmModal: React.FC<ConfirmModalProps> = ({title, onConfirm, onCancel, showConfirm, onClose}) => {

    const handleConfirm = () => {

        onClose();
        if (onConfirm) {
            onConfirm();
        }
    };

    const handleCancel = () => {

        onClose();
        if (onCancel) {
            onCancel();
        }
    };


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirm}
            onRequestClose={() => {
                onClose();
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        {title}
                    </Text>
                    <View style={styles.buttonBox}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonOpen]}
                            onPress={handleConfirm}
                        >
                            <Text style={styles.textStyle}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonClose]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.textStyle}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default ConfirmModal;
