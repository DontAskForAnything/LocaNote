const express = require("express");
const app = express();
const port = 6969;

const flashcards = [
  `What are the two major groups of modern turtles and how do they differ in head retraction?;Modern turtles are divided into two major groups, the Pleurodira (side necked turtles) and Cryptodira (hidden necked turtles). They differ in the way the head retracts.

  How many living and recently extinct species of turtles are there?;There are 360 living and recently extinct species of turtles.
  
  What is the outer surface of a turtle shell covered in?;The outer surface of a turtle shell is covered in scales made of keratin, the material of hair, horns, and claws.
  
  What is the upper part of a turtle shell called?;The upper part of a turtle shell is called the domed carapace.
  
  What is the lower part of a turtle shell called?;The lower part of a turtle shell is called the plastron or belly-plate.
  
  What is the general temperature regulation characteristic of turtles?;Turtles are ectotherms or "cold-blooded," meaning that their internal temperature varies with their direct environment.
  
  What is the main diet of turtles?;Turtles are generally opportunistic omnivores and mainly feed on plants and animals with limited movements.
  
  Which group of turtles is known for migrating long distances to lay their eggs on a favored beach?;Sea turtles are the only reptiles that migrate long distances to lay their eggs on a favored beach.
  
  Do turtles lay their eggs underwater?;No, turtles do not lay their eggs underwater.`,
  `What is the official name of Poland in Polish?;The official name of Poland in Polish is "Rzeczpospolita Polska."

  Which bodies of water are located to the north of Poland?;Poland is located between the Baltic Sea to the north and the Sudetes and Carpathian Mountains to the south.
  
  Which countries share land borders with Poland?;Poland shares land borders with Russia (Kaliningrad Oblast) and Lithuania to the north, Belarus and Ukraine to the east, Slovakia and the Czech Republic to the south, and Germany to the west.
  
  What is the area of Poland's administrative territory?;The administrative territory of Poland covers 312,696 square kilometers, ranking it 69th in the world and 9th in Europe.
  
  What is the population of Poland as of 2022?;As of 2022, Poland has a population of 37,766,327 people.
  
  Which city is the capital of Poland?;The capital of Poland is Warsaw.
  
  Name some other major cities in Poland.;Other major cities in Poland include Kraków, Wrocław, Łódź, Poznań, Gdańsk, and Szczecin.
  
  What is the predominant ethnic group in Poland?;The predominant ethnic group in Poland is Polish, with 97% of the population declaring Polish nationality.
  
  In what year did Poland's first historically confirmed date occur, involving the baptism of its ruler?;Poland's first historically confirmed date is the year 966 when Duke Mieszko I, the ruler of the territories that largely make up present-day Poland, was baptized.
  
  When did the Kingdom of Poland come into existence, and who was its first king?;The Kingdom of Poland was established in 1025, and its first king was Bolesław I Chrobry, the son of Duke Mieszko I.
  
  What significant union was formed in 1569, and what was its outcome in terms of territory?;In 1569, Poland formed a union with the Grand Duchy of Lithuania through the Union of Lublin, resulting in the creation of the Polish-Lithuanian Commonwealth, one of the largest and most populous states in 16th and 17th century Europe.
  
  What was the internal political system of the Polish-Lithuanian Commonwealth referred to as?;The internal political system of the Polish-Lithuanian Commonwealth is known as a "democracy of nobility" or "democracy szlachecka," where the monarch was elected through a system known as "free election" or "wolna elekcja."
  
  When did the Polish-Lithuanian Commonwealth cease to exist, and how did its territory get divided?;The Polish-Lithuanian Commonwealth ceased to exist in 1795 due to the Third Partition, and its territory was divided among Prussia, Russia, and Austria.
  `,
  `INVALID RESPONSE ( add to run one more time )`,
  `What was the Celtic kingdom established in Austria during the late Iron Age, and when did it exist?;The Celtic kingdom established in Austria during the late Iron Age was referred to by the Romans as Noricum and existed from around 800 to 400 BC.

    When did the lands south of the Danube in Austria become part of the Roman Empire?;The lands south of the Danube in Austria became part of the Roman Empire at the end of the 1st century BC.

    Which Germanic people occupied the lands in Austria during the Migration Period in the 6th century?;During the Migration Period in the 6th century, the Bavarii, a Germanic people, occupied the lands in Austria.

    When did Austria adopt the name "Ostarrîchi," and under what political entities was it associated at the time?;Austria adopted the name "Ostarrîchi" in 996 AD when it was a margravate of the Duchy of Bavaria, and from 1156, it was an independent duchy (later archduchy) of the Holy Roman Empire (Heiliges Römisches Reich 962–1806).

    Which noble houses dominated Austria from 1273 to 1918?;Austria was dominated by the House of Habsburg and House of Habsburg-Lorraine (Haus Österreich) from 1273 to 1918.

    What did Austria become in 1806 when the Holy Roman Empire was dissolved by Emperor Francis II of Austria?;In 1806, when Emperor Francis II of Austria dissolved the Holy Roman Empire, Austria became the Austrian Empire.

    What major political change occurred in Austria in 1867, and what did it result in?;In 1867, Austria formed a dual monarchy with Hungary, resulting in the Austro-Hungarian Empire (1867–1918).

    After the collapse of the Austro-Hungarian Empire following World War I, what was the name adopted by Austria for its reduced territory?;After the collapse of the Austro-Hungarian Empire following World War I, Austria adopted the name "The Republic of German-Austria" for its reduced territory.

    What event in 1938 led to the annexation of Austria to the German Reich under Adolf Hitler's rule?;In 1938, Adolf Hitler annexed Austria to the German Reich under the concept of "Anschluss," which was supported by a large majority of the Austrian people.

    When did Austria regain its independence as the Second Austrian Republic, following the end of World War II?;Austria regained its independence as the Second Austrian Republic in 1955, ten years after the end of World War II.

    When did Austria join the European Union?;Austria joined the European Union in 1995.`,
];

const topics = [
  `Mathematics Basics: An Introduction to Numbers
  Counting and Cardinality: Understanding Number Sequences
  Addition and Subtraction: The Fundamentals of Arithmetic
  Multiplication and Division: Building a Strong Mathematical Foundation
  Place Value: Deciphering the Value of Digits
  Basic Fractions: Dividing Shapes and Quantities
  Geometry Essentials: Exploring Shapes and Spatial Concepts
  Measurement Matters: Understanding Length, Weight, and Capacity
  Time and Clocks: Telling Time and Measuring Intervals
  Basic Probability: Grasping the Concepts of Chance and Likelihood
  Introduction to Algebra: Solving for Unknowns in Equations
  Graphs and Data: Representing Information Visually
  Mathematical Patterns: Recognizing and Extending Sequences
  Problem-Solving Strategies: Techniques for Mathematical Challenges`,
  `Polish Language Basics: A Beginner's Guide
  Introduction to Polish: The Beauty of a Slavic Language
  Polish Alphabet: Learning the 32 Letters and Their Sounds
  Pronunciation Tips: Perfecting the Polish Accent
  Greetings and Introductions: Meeting and Connecting in Polish
  Common Phrases: Expressing Yourself in Everyday Situations
  Polish Numbers: Counting and Using Numerals
  Basic Polish Grammar: Understanding Nouns, Verbs, and Adjectives
  Sentence Structure: Forming Coherent Sentences in Polish
  Polish Pronouns: Identifying and Using Personal Pronouns
  Polite Expressions: Being Courteous in the Polish Language
  Time and Dates: Telling Time and Scheduling Appointments
  Family and Relationships: Discussing Relatives and Loved Ones
  Food and Dining: Ordering and Enjoying Polish Cuisine
  Travel and Directions: Navigating Poland with Confidence
  Colors and Descriptions: Expressing What You See
  Weather Talk: Discussing Conditions and Forecasts
  Holidays and Celebrations: Embracing Polish Traditions
  Polish Culture: Understanding the Rich Heritage of Poland
  Effective Language Learning: Tips for Mastering Polish Basics`,
  `INVALID ANSWER ( rerun )`,
];

app.use(express.json());

// No sleep
app.get("/api/flashcards", (req, res) => {
  res.json({ text: flashcards[Math.floor(Math.random() * flashcards.length)] });
});

// Sleep timeout
app.get("/api/flashcardsSlow", (req, res) => {
  const delay = Math.floor(Math.random() * 11000) + 10000;

  setTimeout(() => {
    const randomFlashcard =
      flashcards[Math.floor(Math.random() * flashcards.length)];
    res.json({ text: randomFlashcard });
  }, delay);
});

// No sleep
app.get("/api/topics", (req, res) => {
  res.json({ text: topics[Math.floor(Math.random() * topics.length)] });
});

// Sleep timeout
app.get("/api/topicsSlow", (req, res) => {
  const delay = Math.floor(Math.random() * 11000) + 10000;

  setTimeout(() => {
    res.json({ text: topics[Math.floor(Math.random() * topics.length)] });
  }, delay);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
