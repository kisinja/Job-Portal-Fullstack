import { FaRocket } from "react-icons/fa";

const GetNoticed = () => {
    return (
        <div className="w-full bg-white p-4 rounded shadow flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <FaRocket className="text-blue text-xl" />
                Get noticed faster
            </h3>
            <p className="text-primary/70 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At, id molestiae! Voluptatum, reprehenderit commodi. Quasi delectus odio fugit id eaque!
            </p>

            <button type="submit" className="bg-blue text-white py-2 px-5 rounded-md ">Upload your resume</button>
        </div>
    )
}

export default GetNoticed