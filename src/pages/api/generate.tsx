import { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosRequestConfig } from 'axios';

const COHERE_API_KEY = process.env.NEXT_PUBLIC_COHERE_API_KEY;
const COHERE_API_URL = process.env.NEXT_PUBLIC_COHERE_API_URL;

interface StoryGenerationResponse {
  generations: {
    text: string;
  }[];
}


const generateStoryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { gradeLevel } = req.body;
  const storyLength: { [key: string]: number } = {
    "1": 250, 
    "2": 350, 
    "3": 500, 
    "4": 600, 
    "5": 800
  }

  // Prompt 
  const prompt = `
    Generate a ${storyLength[gradeLevel]}-words long story suitable for grade ${gradeLevel} students with a title. 
    Generate an array of five multiple-choice questions with the correct answer indicated based on the story generated for students of grade ${gradeLevel}. 
    
    Return generated text within the following template:

      Title: [Title of the Story]

      Story: [Insert generated story here]

      Questions: [Insert the question, 4 choices for each question and its correct answer for each question using following template]

          1. [Question 1] \n \n
          A. [Choice A] \n
          B. [Choice B] \n
          C. [Choice C] \n
          D. [Choice D] \n
          Correct answer: [insert correct answer]. \n \n \n

          2. [Question 2] \n \n
          A. [Choice A] \n
          B. [Choice B] \n
          C. [Choice C] \n
          D. [Choice D] \n
          Correct answer: [insert correct answer for question 2]. \n \n \n

          3. [Question 3] \n \n
          A. [Choice A] \n
          B. [Choice B] \n
          C. [Choice C] \n
          D. [Choice D] \n
          Correct answer: [insert correct answer]. \n \n \n

          4. [Question 4] \n \n
          A. [Choice A] \n
          B. [Choice B] \n
          C. [Choice C] \n
          D. [Choice D] \n
          Correct answer: [insert correct answer]. \n \n \n

          5. [Question 5] \n \n
          A. [Choice A] \n
          B. [Choice B] \n
          C. [Choice C] \n
          D. [Choice D] \n
          Correct answer: [insert correct answer]. \n \n \n
    `;

  // Define the options for the API request to generate the story
  const options: AxiosRequestConfig = {
    method: 'POST',
    url: COHERE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${COHERE_API_KEY}`,
    },
    data: JSON.stringify({
      max_tokens: 1500,
      return_likelihoods: 'NONE',
      truncate: 'END',
      prompt: prompt,
    }),
  };

  try {
    // Generate the story
    const storyResponse = await axios.request(options);
    const storyData = storyResponse.data;
    const story: string = storyData.generations[0].text;
    console.log(story);
    res.status(200).json(story);
  } catch (error) {
    console.error('Error generating story and questions:', error);
    res.status(500).json({ error: 'Error generating story and questions' });
  }
};

export default generateStoryHandler;
