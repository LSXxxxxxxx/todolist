import React, {useEffect, useState} from 'react';
import { View, ActivityIndicator, Text, TextInput, StyleSheet, ScrollView,  ToastAndroid } from 'react-native';
import Button from '../components/Button';
import ImagePicker from '../components/ImagePicker';
import Colors from '../themes/Colors';
import Fonts from '../themes/Fonts';
import {addTodoItem, uploadImage} from "../services/firebase";

interface AddEditTodoScreenProps {
  route: any;
  navigation: any;
}

const AddTodoScreen: React.FC<AddEditTodoScreenProps> = ({ route, navigation }) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    if (!title.trim()) {
      setErrorMessage('Please enter a complete title and description.');
      return;
    }
    let imageUrl = '';

    setErrorMessage(null);
    if (imageUri) {
      try {
        const url = await uploadImage(imageUri);
        imageUrl = url;
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await addTodoItem({
        title,
        description,
        imageUri: imageUrl,
        isCompleted: false,
        createdAt: new Date(),
      });

      ToastAndroid.show("Add todo successfully", ToastAndroid.SHORT);
    } catch (err) {
        console.log(err);
        ToastAndroid.show("Add todo failed", ToastAndroid.SHORT);
    } finally {
       setLoading(false);
    }
  }

  useEffect(() => {
    if (title || description) {
      setErrorMessage('');
    }
  }, [title, description]);

  return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add New Todo</Text>
        {errorMessage && <Text style={styles.error}>{errorMessage} </Text>}
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
        <ImagePicker onImagePicked={setImageUri} />
        <Button
            loading={loading}
            title="Save" onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
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
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddTodoScreen;
