import { Topic } from "../types";
import * as Crypto from "expo-crypto";
import { _client, _endpoint, _model } from "../ai";

export const generateTopics = async (
  topic: Readonly<string>,
  size: Readonly<number>,
) => {
  return new Promise<Topic[]>((resolve) => {
    const params = {
      model: _model,
      messages: [
        {
          role: "user",
          content: `Generate an array of ${size} lessons title. There should be a separate lesson title and a very short description for every distinct piece of information. Your lessons should be based on the topic provided in the prompt. Format the response in this format:\ntopic:description\nanother topic: another description`,
        },
        {
          role: "user",
          content: topic,
        },
      ],
    };
    try {
      _client.post(_endpoint, params).then((response) => {
        const text = response.data["choices"][0]["message"]["content"];
        const lines = text.split("\n");
        const courseArray = [];

        for (const line of lines) {
          const id = Crypto.randomUUID();
          const [title, description] = line.split(": ");
          courseArray.push({
            id,
            title: title || null,
            description: description || null,
            flashcards: [],
            questions: [],
            notes: [],
          });
        }

        resolve(courseArray as Topic[]);
      });
    } catch (err) {
      // reject(err);
      //TODO: add not matching response error
      //TODO: navigate to error screen
    }
  });
};
