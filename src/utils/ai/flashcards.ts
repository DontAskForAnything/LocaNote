import { Flashcard } from "../types";
import { _client, _endpoint, _model } from "../ai";

export const generateFlashcards = async (content: Readonly<string>) => {
  return new Promise<Flashcard[]>((resolve) => {
    const params = {
      model: _model,
      messages: [
        {
          role: "user",
          content:
            "Generate an array of question-answer flashcards. There should be a separate flashcard for every distinct piece of information. You should only use information included in the prompt. Returns only flashcards that match flashcards format:\nquestion;answer\nanother question;another answer.",
        },
        {
          role: "user",
          content: content,
        },
      ],
    };
    try {
      _client.post(_endpoint, params).then((response) => {
        const text = response.data["choices"][0]["message"]["content"];
        console.log(text);
        //TODO: FIX IT PLZ
        const flashcards = text
          .split("\n")
          .slice(1)
          .map((line: string) => {
            const [question, answer] = line.split(";");
            if (question && answer) {
              return {
                question: question.replace(/^\d+\.\s*/, "").trim(),
                answer: answer.trim(),
              };
            }
          });

        console.log(flashcards);
        resolve(flashcards as Flashcard[]);
      });
    } catch (err) {
      // reject(err);
      //TODO: add not matching response error
      //TODO: navigate to error screen
    }
  });
};
