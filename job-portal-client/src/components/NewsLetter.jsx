import EmailMe from "./EmailMe";
import GetNoticed from "./GetNoticed";

const NewsLetter = () => {
    return (
        <div className="flex flex-col gap-12">
            <EmailMe />
            <GetNoticed />
        </div>
    );
};

export default NewsLetter