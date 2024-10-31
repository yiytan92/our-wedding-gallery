function LoadingBar() {
  return (
    <div className="mt-10 mb-10 flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-8 h-8 bg-red-800 rounded-full"></div>
      <div className="w-8 h-8 bg-red-800 rounded-full"></div>
      <div className="w-8 h-8 bg-red-800 rounded-full"></div>
    </div>
  );
}

export default LoadingBar;
