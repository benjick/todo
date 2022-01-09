import { EmojiHappyIcon } from "@heroicons/react/outline";

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center mt-12 pb-4 px-4">
      <EmojiHappyIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No more tasks!</h3>
      <p className="mt-1 text-sm text-gray-500">
        Good job! Add some more or relax for the day!
      </p>
    </div>
  );
};
