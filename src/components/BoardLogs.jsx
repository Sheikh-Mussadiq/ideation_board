import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Clock, Loader2 } from 'lucide-react';
import { fetchBoardLogs } from '../services/boardService';
import { formatDistanceToNow } from 'date-fns';

const LogShimmer = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 items-start">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const processLogMessage = (log) => {
  // Skip logs that only changed updated_at
  if (log.message.includes('Changed fields: updated_at') && 
      !log.message.includes(',')) {
    return null;
  }

  // Remove updated_at from the fields list if there are other changes
  if (log.message.includes(', updated_at')) {
    return {
      ...log,
      message: log.message.replace(', updated_at', '')
    };
  }

  if (log.message.includes('updated_at, ')) {
    return {
      ...log,
      message: log.message.replace('updated_at, ', '')
    };
  }

  return log;
};

export default function BoardLogs({ isOpen, setIsOpen, boardId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      if (isOpen && boardId) {
        setLoading(true);
        try {
          const boardLogs = await fetchBoardLogs(boardId);
          // Process logs before setting them
          const processedLogs = boardLogs
            .map(processLogMessage)
            .filter(Boolean); // Remove null entries
          setLogs(processedLogs);
        } catch (error) {
          console.error('Error fetching logs:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadLogs();
  }, [isOpen, boardId]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={setIsOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/25 dark:bg-black/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-design-black shadow-xl">
                    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-design-black border-b border-gray-200 dark:border-gray-800">
                      <Dialog.Title className="text-lg font-semibold">
                        Board Activity Log
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 px-6 py-4">
                      {loading ? (
                        <LogShimmer />
                      ) : logs.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                          No activity logs found
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className="flex gap-4 items-start animate-in slide-in-from-right duration-300"
                            >
                              <div className="mt-1 p-2 rounded-full bg-primary-light dark:bg-primary-dark">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {log.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
