// Here types
export type SubjectItem = {
  id: string;
  title: string;
  // Because this will be icon name if will be wrong big question mark will appear
  icon: any; // eslint-disable-line
  color: string;
};

export type Flashcard = {
  question: string;
  answer: string;
}