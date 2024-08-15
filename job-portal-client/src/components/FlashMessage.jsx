import { useEffect } from 'react';

const FlashMessage = ({ message, clearMessage }) => {
    useEffect(() => {
        // Automatically clear the message after 3 seconds
        const timer = setTimeout(() => {
            clearMessage();
        }, 3000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, [clearMessage]);

    if (!message) return null;

    return (
        <div className="flash-message">
            {message}
        </div>
    );
};

export default FlashMessage;
