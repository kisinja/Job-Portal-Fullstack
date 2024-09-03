import { SiMinutemailer } from "react-icons/si";

const EmailMe = () => {
    return (
        <div className="w-full bg-white p-4 rounded shadow flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <SiMinutemailer className="text-blue text-xl" />
                Email me for jobs
            </h3>
            <p className="text-primary/70 text-sm">
                Stay updated! Enter your email to receive our newsletter with the latest news and updates.
            </p>

            <form action="" className="flex flex-col gap-3">
                <input type="text" placeholder='eg..name@mail.com' className="border rounded-md placeholder:text-gray-300 text-gray-500 py-2 px-6 w-full" />
                <button type="submit" className="bg-blue text-white py-2 px-5 rounded-md focus:bg-orange-50 focus:text-black focus:ring-4 focus:ring-blue focus:outline-none">Subscribe</button>
            </form>
        </div>
    )
}

export default EmailMe
