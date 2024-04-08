
import React, { useEffect, useState } from 'react';
import {View, ScrollView, Text, TextInput, StyleSheet, ToastAndroid, ActivityIndicator, Switch} from 'react-native';
import Button from '../components/Button';
import ImagePicker from '../components/ImagePicker';
import Colors from '../themes/Colors';
import Fonts from '../themes/Fonts';
import {deleteTodoItem, getTodoById, updateTodoItem, uploadImage} from "../services/firebase";
import ConfirmModal from "../components/ConfirmModal";

interface EditTodoScreenProps {
    route: any;
    navigation: any;
}

const EditTodoScreen: React.FC<EditTodoScreenProps> = ({ route, navigation }) => {
    const { todoId } = route.params;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [shareLocation, setShareLocation] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const todo = await getTodoById(todoId);
                if (todo) {
                    setTitle(todo.title);
                    setDescription(todo.description || '');
                    setIsCompleted(todo.isCompleted);
                    setImageUri(todo.imageUri || null);
                    // Assuming 'location' being not null implies sharing location was enabled
                    setShareLocation(!!todo.location);
                }
            } catch (err) {
                console.error(err);
                ToastAndroid.show("Failed to fetch todo", ToastAndroid.SHORT);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        if (todoId) {
            fetchTodo();
        }
    }, [todoId]);

    const handleSave = async () => {
        if (!title.trim()) {
            setErrorMessage('Please enter a complete title.');
            return;
        }
        setSaveLoading(true);

        let imageUrl = imageUri;

        if (imageUri && !imageUri.startsWith('http')) {
            try {
                imageUrl = await uploadImage(imageUri);
            } catch (err) {
                console.error(err);
            }
        }

        try {
            await updateTodoItem(todoId, {
                title,
                description,
                isCompleted,
                imageUri: imageUrl || '',
            });

            ToastAndroid.show("Todo updated successfully", ToastAndroid.SHORT);
            navigation.goBack();
        } catch (err) {
            console.error(err);
            ToastAndroid.show("Failed to update todo", ToastAndroid.SHORT);
        } finally {
            setSaveLoading(false);
        }
    };

    const handleRemove = async () => {
        try {
            await deleteTodoItem(todoId);
            ToastAndroid.show("Todo deleted successfully", ToastAndroid.SHORT)
            navigation.goBack();
        } catch (err) {

        }
    }

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.title}>Edit Todo</Text>
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Enter todo title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter description"
                multiline={true}
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
            />
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Completed:</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isCompleted ? "#f5dd4b" : "#f4f3f4"}
                    onValueChange={setIsCompleted}
                    value={isCompleted}
                />
            </View>
            <ImagePicker defaultImageUri={imageUri || ''} onImagePicked={setImageUri} />
            <Button
                loading={saveLoading}
                title="Save" onPress={handleSave} style={styles.saveButton} />

            <Button
                title="Delete" onPress={() => {
                    setShowConfirm(true)
            }} style={styles.deleteButton} />

            <ConfirmModal
                title={"Do you want to delete this todo?"}
                showConfirm={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={() => {
                    handleRemove();
                }}
                onCancel={() => {}}
            />
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 16,
    },
    title: {
        fontFamily: Fonts.bold,
        fontSize: 24,
        color: Colors.primary,
        marginTop: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.lightGray,
    },
    descriptionInput: {
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: 16,
        backgroundColor: Colors.primary,
        color: Colors.white,
        paddingVertical: 12,
        borderRadius: 8,
    },
    deleteButton: {
        marginTop: 16,
        backgroundColor: Colors.error,
        color: Colors.white,
        paddingVertical: 12,
        borderRadius: 8,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    switchLabel: {
        fontFamily: Fonts.regular,
        fontSize: 16,
        color: Colors.text,
    },
});

export default EditTodoScreen;
