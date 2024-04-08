import React, {useEffect, useState} from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImageSelector from 'expo-image-picker';
import Colors from '../themes/Colors';

interface ImagePickerProps {
  onImagePicked: (uri: string) => void;
  defaultImageUri?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ onImagePicked, defaultImageUri }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  useEffect(() => {
    if (defaultImageUri) {
      setImageUri(defaultImageUri);
    }
  }, [defaultImageUri]);

  const handleImagePicker = async (type: 'camera' | 'library') => {
    try {
      const { status } = await ImageSelector.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
        return;
      }

      let result: ImageSelector.ImagePickerResult | null = null;
      if (type === 'camera') {
        result = await ImageSelector.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImageSelector.launchImageLibraryAsync({
          mediaTypes: ImageSelector.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result?.canceled) {
        setImageUri(result.assets[0].uri);
        onImagePicked(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri && (
          <TouchableOpacity>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </TouchableOpacity>
      )}
      <View style={styles.placeholderContainer}>
        <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleImagePicker('camera')}
        >
          <Image source={require('../assets/images/camera.png')} style={styles.placeholderIcon} />
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleImagePicker('library')}
        >
          <Image source={require('../assets/images/photo.png')} style={styles.placeholderIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  placeholderIcon: {
    width: 48,
    height: 48,
  },
});

export default ImagePicker;
