export type SubjectItem = {
  id: string;
  title: string;
  // Because this will be icon name if will be wrong big question mark will appear
  icon: any; // eslint-disable-line
  color: string;
};

export type Topic = {
  id: string;
  title: string | null;
  description: string | null;
  flashcards: { front: string; back: string }[] | [];
  questions:
    | { question: string; correctAnswers: string; answers: string[] }
    | [];
  notes: string[] | [];
};

export type SubjectPulledItem = {
  topics: Topic[] | null | [];
};
