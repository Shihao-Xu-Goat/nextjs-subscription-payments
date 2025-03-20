const LoadingDots = () => {
  return (
    <span className="inline-flex text-center items-center leading-7">
      <span className="bg-zinc-200 rounded-full h-2 w-2 animate-blink mx-0.5" />
      <span className="bg-zinc-200 rounded-full h-2 w-2 animate-blink mx-0.5 animation-delay-200" />
      <span className="bg-zinc-200 rounded-full h-2 w-2 animate-blink mx-0.5 animation-delay-400" />
    </span>
  );
};

export default LoadingDots;
