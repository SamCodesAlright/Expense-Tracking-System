import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/images/heroImage.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl leading-16">
            Track Your
            <strong className="text-lime-600"> Expenses </strong>
            Effortlessly
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Every rupee counts! Log your expenses, analyze trends, and make
            smarter financial decisions with our powerful tracking tool.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <button
              onClick={handleGetStarted}
              className="inline-block rounded border border-lime-600 bg-lime-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-lime-700 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* 👇 Image Below Button */}
          <div className="mt-8 flex justify-center">
            <img
              src={heroImage}
              alt="Expense Tracker Illustration"
              className="w-full max-w-[90rem] rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
