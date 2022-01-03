import { Item, useTodo } from "../src/state";
import { BadgeCheckIcon, BellIcon } from "@heroicons/react/solid";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, ClockIcon } from "@heroicons/react/outline";
import { msToTime } from "../src/helpers";
import useSound from "use-sound";
import lofiBells from "../assets/lofi-bells.mp3";

const Child: React.FC<{ title: string; onClick: (e: any) => void; icon: any }> =
  ({ children, title, onClick, icon: Icon }) => {
    return (
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="w-full inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <Icon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{children}</p>
              </div>
            </div>
          </div>
          {onClick && (
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                onClick={onClick}
              >
                I&apos;m done!
              </button>
            </div>
          )}
        </div>
      </Transition.Child>
    );
  };

const Popup: React.FC<{
  showTimer: boolean;
  setShowTimer: (v: boolean) => void;
  finishedTodo: () => void;
  minutes: number;
}> = ({ showTimer, setShowTimer, finishedTodo, minutes }) => {
  const [timeleft, setTimeleft] = useState(() => minutes * 60 * 1000);
  const didStart = useRef(false);

  const [play] = useSound(lofiBells);

  const intervalRef = useRef<NodeJS.Timer>();

  const ms = 100;

  useEffect(() => {
    // TODO: Maybe redo this to something better compares to the opened time instead
    if (showTimer && !didStart.current) {
      didStart.current = true;
      intervalRef.current = setInterval(() => {
        setTimeleft((timeleft) => timeleft - ms);
      }, ms);
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [showTimer, timeleft, play]);

  useEffect(() => {
    if (intervalRef.current && timeleft < 1) {
      play();
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [timeleft, play]);

  return (
    <Transition.Root show={showTimer} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setShowTimer}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          {timeleft > 0 ? (
            <Child
              onClick={finishedTodo}
              title="Timer running"
              icon={ClockIcon}
            >
              {msToTime(timeleft)}
            </Child>
          ) : (
            <Child onClick={finishedTodo} title="You're done!" icon={CheckIcon}>
              Good job buddy!
            </Child>
          )}
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const TodoItem: React.FC<{ item: Item }> = ({ item }) => {
  const [showTimer, setShowTimer] = useState(false);
  const { finishTodo } = useTodo();

  function startTodo() {
    setShowTimer(true);
  }

  function finishedTodo() {
    setShowTimer(false);
    setTimeout(() => {
      finishTodo(item.id);
    }, 200);
  }

  return (
    <li className="py-4">
      {item.timerMinutes ? (
        <Popup
          showTimer={showTimer}
          setShowTimer={setShowTimer}
          finishedTodo={finishedTodo}
          minutes={item.timerMinutes}
        />
      ) : undefined}
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {item.timerMinutes ? (
            <BellIcon style={{ width: 25 }} />
          ) : (
            <BadgeCheckIcon style={{ width: 25 }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </p>
        </div>
        <div>
          {item.timerMinutes ? (
            <button
              onClick={() => startTodo()}
              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => finishTodo(item.id)}
              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </li>
  );
};
