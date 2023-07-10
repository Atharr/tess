import { readFileSync } from 'fs';
import { load } from 'js-yaml';

const Msg = {};

export const loadMessages = (language, messagesPath) => {
  try {
    const messagesFile = `${messagesPath}.${language}.yaml`;
    const fileContents = readFileSync(messagesFile, 'utf8');

    Object.assign(Msg, load(fileContents));
  } catch (error) {
    console.error(`Invalid or missing messages file for language '${language}':`, error.message);

    if (Object.keys(Msg).length === 0) {
      throw new Error("No messages loaded.");
    }
  }
}

export default Msg;