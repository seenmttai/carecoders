import React from 'react';
import Button from './Button';

const FeatureUnderDevelopment = () => {
  return (
    <div className="py-16 text-center">
      <div className="max-w-xl mx-auto">
        {/* GIF */}
        <img 
          src='https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHd2Ym9kZHR5emg5bzIyOGxkdm0yYnMxcDl1dmR2dDJ0MzByYTJpbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eqojrPjRoNxnz8OWH8/giphy.gif'
          alt="Under Development"
          className="w-full h-auto mb-4"
        />
        

        {/* Message */}
        <h2 className="text-2xl font-bold text-green-600">
          We are working on this feature!
        </h2>
        <Button href="/" label="Go back to home" />
      </div>
    </div>
  );
};

export default FeatureUnderDevelopment;
