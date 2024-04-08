import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../themes/Colors';
import Fonts from '../themes/Fonts';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    status: 'processing' | 'done';
  };
  onPress: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onPress }) => {
  const statusColor = todo.status === 'processing' ? Colors.warning : Colors.success;

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(todo.id)}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{todo.title}</Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor: statusColor }]}>
        <Text style={styles.statusText}>{todo.status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.text,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.white,
  },
});

export default TodoItem;