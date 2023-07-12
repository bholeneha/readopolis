import React from 'react';

interface QuestionCardProps {
  question: string;
  choices: {text: string; isCorrect: boolean}[];
//   answerIndex: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, choices }) => {
    const legend: {[key: number]: string} = {0:"A", 1:"B", 2:"C", 3:"D"};
    console.log(choices);

    return (
        <div>
            <p>{question}</p>
            <ul>
                {choices.map((choice, index) => (
                <li key={index} className={index === 1 ? 'selected' : ''}>
                    <label>
                        <input type="radio" name={`question${index}`} value={index} />
                        <span>{legend[index]}: {choice.text}</span>
                    </label>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestionCard;
