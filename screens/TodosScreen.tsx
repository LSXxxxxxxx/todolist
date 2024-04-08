import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { TodoItem, getAllTodos } from '../services/firebase';
import { useFocusEffect } from "@react-navigation/native";
import { FAB } from 'react-native-paper';
import BouncyCheckbox from "react-native-bouncy-checkbox";
interface TodosScreenProps {
    navigation: any;
}
const TodosScreen: React.FC<TodosScreenProps> = ({ navigation }) => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showCompleted, setShowCompleted] = useState<boolean>(true);
    const [showNotCompleted, setShowNotCompleted] = useState<boolean>(true);

    const displayedTodos = useMemo(() => {
        return todos.filter((todo) => {
            if (showCompleted && showNotCompleted) {
                return true;
            }

            if (showCompleted && todo.isCompleted) {
                return true;
            }

            if (showNotCompleted && !todo.isCompleted) {
                return true;
            }

            return false;
        });
    }, [todos, showCompleted, showNotCompleted]);
    useFocusEffect(React.useCallback(() => {
        const fetchTodos = async () => {
            setIsLoading(true);
            const fetchedTodos = await getAllTodos();
            setTodos(fetchedTodos);
            setIsLoading(false);
        };

        fetchTodos();
    }, []));

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground resizeMode="cover" style={styles.backgroundImage} source={require('../assets/images/bg.jpg')}>
                {todos.length === 0 && (
                    <View style={styles.emptyBox}>
                        <Image style={styles.emptyIcon} source={require('../assets/images/empty-box.png')} />
                        <Text>
                            No todos found
                        </Text>
                    </View>
                )}

                <FAB
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 10,
                        bottom: 10,
                        zIndex: 1000
                    }}
                    small
                    icon="plus"
                    onPress={() => {
                        navigation.navigate('AddTodo');
                    }}
                />
                <View style={styles.filterBox}>
                    <BouncyCheckbox
                        isChecked={showCompleted}
                        text={"Completed"}
                        textStyle={styles.filterText}
                        onPress={(isChecked: boolean) => {
                            setShowCompleted(isChecked)
                        }} />

                    <BouncyCheckbox
                        textStyle={styles.filterText}
                        isChecked={showNotCompleted}
                        text={"Not Completed"}
                        onPress={(isChecked: boolean) => {
                            setShowNotCompleted(isChecked)
                        }}
                    />


                </View>
                <FlatList
                    data={displayedTodos}
                    keyExtractor={(item, index) => `todo-${index}`}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('EditTodo', { todoId: item.id })
                            }}
                        >
                            <View style={styles.todoItem}>
                                <Image source={{ uri: item.imageUri }} style={styles.image} />
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                    <Text style={styles.date}>
                                        Created at: {item.createdAt.toLocaleDateString()}
                                    </Text>
                                    <Text style={item.isCompleted ? styles.completed : styles.notCompleted}>
                                        {item.isCompleted ? 'Completed' : 'Not Completed'}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    filterText: {
        textDecorationLine: 'none'
    },
    filterBox: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
    },
    emptyBox: {
        marginTop: 50,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    emptyIcon: {
        width: 100,
        height: 100
    },
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    todoItem: {
        flexDirection: 'row',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    completed: {
        fontWeight: 'bold',
        color: 'green',
    },
    notCompleted: {
        fontWeight: 'bold',
        color: 'red',
    },
});

export default TodosScreen;
