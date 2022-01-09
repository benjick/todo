import { useEffect, useRef, useState } from "react";

export const PopupDelete: React.FC<{ onClick: Function }> = ({ onClick }) => {
  const [waiting, setWaiting] = useState(false);
  const timeout = useRef<any>();

  function handleClick() {
    if (!waiting) {
      setWaiting(true);
      timeout.current = setTimeout(() => {
        setWaiting(false);
      }, 5000);
    } else {
      onClick();
      setWaiting(false);
    }
  }

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return (
    <button
      type="button"
      className="mr-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      onClick={handleClick}
    >
      {waiting ? "Confirm" : "Delete"}
    </button>
  );
};
