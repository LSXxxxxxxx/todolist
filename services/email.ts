import {TodoItem} from "./firebase";
import {Linking} from "react-native";

function createTodoItemHTML(todoItem: TodoItem) {
    const { title, description = 'No description provided.', isCompleted, createdAt, location = 'No location provided.', imageUri } = todoItem;

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    const statusText = isCompleted ? 'Completed' : 'Not Completed';
    const imageHTML = imageUri ? `<img src="${imageUri}" alt="Todo Image" style="max-width: 100%; height: auto; border-radius: 5px;">` : '';

    return `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="color: #333;">${title}</h2>
      <p style="color: #666; font-size: 16px;">${description}</p>
      <p style="font-size: 14px; color: #888;">Status: <strong>${statusText}</strong></p>
      <p style="font-size: 14px; color: #888;">Created At: <strong>${formattedDate}</strong></p>
      ${imageHTML}
    </div>
  `;
}
export const sendEmail = (todoItem: TodoItem, email: string) => {
    console.log(todoItem, email)
    const html = createTodoItemHTML(todoItem);
    console.log('create', html);
    const body = `Todo Item: ${todoItem.title}\n\n  Description: ${todoItem.description}\n\n  Completed: ${todoItem.isCompleted ? 'Yes' : 'No'}\n\n   
    Image: ${todoItem.imageUri}\n
    `;
    Linking.openURL(`mailto:${email}?subject=Todo Item&body=${encodeURIComponent(body)}`);
}
