import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import {TodoItem} from "./firebase";
export const getContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
        const {data} = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });
        if (data.length > 0) {
            return data.filter(item => item.phoneNumbers).slice(0, 50);
        } else {
            return [];
        }
    } else {
        throw new Error('Permission denied');
    }

}

export const sendTodoToSMS = async (todo: TodoItem, contacts: string[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const isAvailable = await SMS.isAvailableAsync();
        if (!isAvailable) {
            reject('SMS is not available on this device');
            return;
        }
        let body = `Title: ${todo.title}\nDescription: ${todo.description}\nCompleted: ${todo.isCompleted ? 'Yes' : 'No'}`;
        if (todo.imageUri) {
            body += `\nImage: ${todo.imageUri}`;
        }
        const { result } = await SMS.sendSMSAsync(
            contacts,
            body,
        );
        if (result === 'sent') {
            resolve();
        } else {
            reject('Failed to send SMS');
        }
    });
}
