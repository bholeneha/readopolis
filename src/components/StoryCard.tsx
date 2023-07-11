import React from 'react';

interface StoryCardProps {
  story: string;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <div>
      <p>{story}</p>
    </div>
  );
};

export default StoryCard;
