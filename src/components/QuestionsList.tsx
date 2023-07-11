import React from 'react';
import QuestionCard from './QuestionCard';

interface QuestionsListProps {
    questions: { 
        question: string; 
        choices: {text: string, isCorrect: boolean}[];
    }[];
}

const QuestionsList: React.FC<QuestionsListProps> = ({ questions }) => {

    console.log(questions);

    return (
        <div>
        <h2>Questions:</h2>
        {questions.map((question, index) => (
            <QuestionCard
            key={index}
            question={question.question}
            choices={question.choices}
            //   answerIndex={question.answerIndex}
            />
        ))}
        </div>
    );
};

export default QuestionsList;
