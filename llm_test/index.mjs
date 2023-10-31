import axios from 'axios';

const endpoint = 'https://api.openai.com/v1/chat/completions';
const apiKey = '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';
const client = axios.create({
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

const data = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "user",
        "content": "Generate an array of 5 question-answer flashcards. There should be a separate flashcard for every distinct piece of information. You should only use information included in the prompt. Do not number those flashcards. Format the response in this format:\nquestion;answer\nanother question;another answer"
      },
      {
        "role": "user",
        "content": "The cat (Felis catus), commonly referred to as the domestic cat or house cat, is the only domesticated species in the family Felidae. Recent advances in archaeology and genetics have shown that the domestication of the cat occurred in the Near East around 7500 BC. It is commonly kept as a house pet and farm cat, but also ranges freely as a feral cat avoiding human contact. It is valued by humans for companionship and its ability to kill vermin. Because of its retractable claws it is adapted to killing small prey like mice and rats. It has a strong flexible body, quick reflexes, sharp teeth, and its night vision and sense of smell are well developed. It is a social species, but a solitary hunter and a crepuscular predator. Cat communication includes vocalizations like meowing, purring, trilling, hissing, growling, and grunting as well as cat body language. It can hear sounds too faint or too high in frequency for human ears, such as those made by small mammals. It also secretes and perceives pheromones. Female domestic cats can have kittens from spring to late autumn in temperate zones and throughout the year in equatorial regions, with litter sizes often ranging from two to five kittens. Domestic cats are bred and shown at events as registered pedigreed cats, a hobby known as cat fancy. Animal population control of cats may be achieved by spaying and neutering, but their proliferation and the abandonment of pets has resulted in large numbers of feral cats worldwide, contributing to the extinction of bird, mammal and reptile species.As of 2017, the domestic cat was the second most popular pet in the United States, with 95.6 million cats owned and around 42 million households owning at least one cat. In the United Kingdom, 26% of adults have a cat, with an estimated population of 10.9 million pet cats as of 2020. As of 2021, there were an estimated 220 million owned and 480 million stray cats in the world."
      }
    ]
};


client.post(endpoint,data)
  .then((response) => {
    let text = response.data['choices'][0]['message']['content']
    const lines = text.split('\n');
    const flashcards = [];
    
    for (let i = 0; i < lines.length; i +=1 ) {
      if(lines[i].length > 0){
        const front = lines[i].trim();
        const back = lines[i + 1].trim();
        flashcards.push({ front, back });    i++;
      }
    }
    
    console.log(flashcards);
  })
  .catch((err) => {
    console.log(err.response.data);
  });
