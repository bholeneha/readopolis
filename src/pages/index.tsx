import React, { useState } from 'react';
import StoryCard from '../components/StoryCard';
import QuestionsList from '../components/QuestionsList';

interface Question {
    question: string;
    choices: {text: string; isCorrect: boolean}[];
    selectedAnswer: string | null;
}

interface Choice {
  text: string;
  isCorrect: boolean;
}

const generateQuestionsArray = (questionsString: string): Question[] => {
  return questionsString.split("\n\n").map((questionString) => {
    const lines = questionString.trim().split("\n");
    const question = lines[0].substring(lines[0].indexOf(" ") + 1);
    let choices: Choice[] = lines.slice(1, -1).map((choice) => {
      const text = choice.trim().substring(2);
      return {
        text: text,
        isCorrect: false,
      };
    });

    const answer = lines[lines.length - 1].substring(
      lines[lines.length - 1].lastIndexOf(" ") + 1
    );
    const answerLegend: { [key: string]: number } = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4 };
    choices[answerLegend[answer]].isCorrect = true;
    return {
      question,
      choices,
      selectedAnswer: null,
    };
  });
};

const Home: React.FC = () => {
    const [title, setTitle] = useState('');
    const [story, setStory] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    // const [answers, setAnswers] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [questionsString, setQuestionsString] = useState('');

    const generateStory = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gradeLevel: '1' }), // Replace with the desired grade level
            });

            const data = await response.json();

            const titleIndex = data.indexOf("Title:")
            const storyIndex = data.indexOf("Story:");
            const questionsIndex = data.indexOf("Questions:");

            const title = data.substring(titleIndex, storyIndex).replace("Title:", "").trim();
            setTitle(title);
            
            const story = data.substring(storyIndex, questionsIndex).replace("Story:", "").trim();
            setStory(story);
            
            const questionsString = data.substring(questionsIndex).replace("Questions:", "").trim();
            setQuestionsString(questionsString);

            const generatedQuestionsArray = generateQuestionsArray(questionsString);
            setQuestions(generatedQuestionsArray);
            console.log(questions)

        } catch (error) {
            console.error('Error generating story:', error);
        }

    setIsLoading(false);
  };



//   const questionsArray: Question[] = questionsString.split("\n\n").map((questionString) => {
//     const lines = questionString.trim().split("\n");
//     const question = lines[0].substring(lines[0].indexOf(" ") + 1);
//     let choices: Choice[] = lines.slice(1, -1).map((choice) => {
//         const text = choice.trim().substring(2)
//         return {
//             text: text,
//             isCorrect: false
//         }
//     });

//     const answer = lines[lines.length - 1].substring(lines[lines.length - 1].lastIndexOf(" ") + 1);
//     const answerLegend: {[key: string]: number} = { "A": 0, "B": 1, "C":2, "D": 3};
//     choices[answerLegend[answer]].isCorrect = true;
//     return {
//         question,
//         choices,
//         selectedAnswer: null, 
//     };
// });

// setQuestions(questionsArray);

//   const handleAnswerChange = (index: number, value: string) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = value;
//     setAnswers(newAnswers);
//   };

//   const checkAnswers = () => {
//     // Compare the user's answers with the correct answers
//     const newQuestions = questions.map((question, index) => {
//       const isCorrect = question.choices[answers[index]].isCorrect;
//       return { ...question, isCorrect };
//     });

//     setQuestions(newQuestions);
//   };

  return (
    <div>
      <h1>Welcome to the Readopolis!</h1>
      <button onClick={generateStory} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Story'}
      </button>
      {title && <h2>{title}</h2>}
      {story && <StoryCard story={story} />}
      {questions?.length > 0 && 
        <QuestionsList 
            questions={questions} 
            // handleAnswerChange={handleAnswerChange} 
            // answers={answers} 
        />}
      {questions?.length > 0 && (
        <div>
          <button 
            // onClick={checkAnswers}
          >Check Answers</button>
        </div>
      )}
    </div>
  );
};

export default Home;
