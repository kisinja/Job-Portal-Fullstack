const Button = ({ onClickHandler, value, title }) => {
  return (
    <button
      onClick={onClickHandler}
      value={value}
      className={`px-4 py-1 border text-base hover:bg-[#3575E2] hover:text-white`}
    >
      {title}
    </button>
  );
};

export default Button;
