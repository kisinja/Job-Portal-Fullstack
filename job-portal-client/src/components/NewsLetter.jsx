import { useAuthContext } from "../hooks/useAuthContext";
import EmailMe from "./EmailMe";
import GetNoticed from "./GetNoticed";

const NewsLetter = () => {
  const { user } = useAuthContext();
  const userRole = user?.role;
  return (
    <div className="flex flex-col gap-12">
      <EmailMe />
      {userRole === "job-seeker" && <GetNoticed />}
    </div>
  );
};

export default NewsLetter;