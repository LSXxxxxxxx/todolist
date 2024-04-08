import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AddTodoScreen from "./screens/AddTodoScreen";
import TodosScreen from "./screens/TodosScreen";
import EditTodoScreen from "./screens/EditTodoScreen";
import React, {Fragment, useState} from "react";
import {Image, StyleSheet, TouchableOpacity, View, ToastAndroid, Button, Modal, FlatList, Text, ImageBackground} from "react-native";

import {getTodoById} from "./services/firebase";
import {getContacts, sendTodoToSMS} from "./services/sms";
import {Contact} from "expo-contacts";
import {sendEmail} from "./services/email";

const Stack = createStackNavigator();

export default function App() {
    const [modalVisible, setModalVisible] = useState(false);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [sentTodoId, setSentTodoId] = useState<string>('');
    const [type, setType] = useState<string>('');
    const handleClickOpenContacts = async (todId: string) => {
        try {
            setSentTodoId(todId);
            const contacts = await getContacts();
            setContacts(contacts);
            setModalVisible(true);
        } catch (err) {
            console.log(err);
            ToastAndroid.show("Failed to share todo to contacts", ToastAndroid.SHORT)
        }
    }
    const handleClickSend = async (contact: Contact) => {
        setModalVisible(false);
        const todo = await getTodoById(sentTodoId);

        if (type === 'sms') {
            if (todo && contact.phoneNumbers && contact.phoneNumbers?.length > 0) {
                try {
                    await sendTodoToSMS(todo, [String(contact.phoneNumbers[0].number)]);
                } catch (err) {
                    console.log(err);
                }
            }
        } else {
            console.log(contact)
            if (todo && contact.emails && contact.emails?.length > 0) {
                await sendEmail(todo, String(contact.emails[0].email));
            }
        }
    }

    return (
        <View style={styles.container}>
            <ImageBackground  resizeMode="cover" style={styles.backgroundImage} source={require('./assets/images/bg.png')}>
            <NavigationContainer>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <FlatList
                        data={contacts}
                        keyExtractor={(item, index) => `contact-${index}`}
                        renderItem={({item}) => (
                            <TouchableOpacity onPress={() => {
                                handleClickSend(item);
                            }} style={styles.contactItem}>
                                <Text style={styles.contactName}>{item.name}</Text>
                                <Text style={styles.contactEmail}>
                                    {item.phoneNumbers?.[0].number || ''}
                                </Text>
                            </TouchableOpacity>
                        )}></FlatList>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            <Stack.Navigator>
                <Stack.Screen name="Todos" component={TodosScreen} options={{title: 'Todos'}}/>
                <Stack.Screen name="AddTodo" component={AddTodoScreen} options={{title: 'Add Todo'}}/>
                <Stack.Screen name={'EditTodo'} component={EditTodoScreen}
                              options={({route, navigation}) => {
                                  const params: any = route.params;
                                  const todoId = params.todoId;

                                  return {
                                      title: 'Todo',
                                      headerRight: () => {
                                          return (
                                              <Fragment>
                                                  <View style={styles.iconContainer}>
                                                      <TouchableOpacity onPress={() => {
                                                          handleClickOpenContacts(todoId);
                                                          setType('sms');
                                                      }}>
                                                          <Image
                                                              style={styles.icon}
                                                              source={require("./assets/images/contacts.png")}/>
                                                      </TouchableOpacity>

                                                      <TouchableOpacity onPress={() => {
                                                          handleClickOpenContacts(todoId)
                                                          setType('email');
                                                      }}>
                                                          <Image
                                                              style={styles.icon}
                                                              source={require("./assets/images/mail.png")}/>
                                                      </TouchableOpacity>
                                                  </View>
                                              </Fragment>
                                          )
                                      }
                                  }
                              }}/>
            </Stack.Navigator>
        </NavigationContainer>
        </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
      },
    iconContainer: {
        display: 'flex',
        gap: 5,
        flexDirection: "row"
    },
    icon: {
        width: 35,
        height: 35,
    },
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
    contactItem: {
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactEmail: {
        fontSize: 14,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
