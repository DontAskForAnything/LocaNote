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
  flashcards: { question: string; answer: string }[] | [];
  notes: string | [];
  authorId: string;
};

export type SubjectPulledItem = {
  topics: Topic[] | null | [];
};

export type Flashcard = {
  question: string;
  answer: string;
};
