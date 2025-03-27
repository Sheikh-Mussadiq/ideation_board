import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function DeleteColumnModal({
  isOpen,
  onClose,
  onConfirm,
  columnTitle,
}) {
  const [countdown, setCountdown] = useState(3);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
      setCountdown(3);
    };
  }, [isOpen]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
                  <AlertCircle className="h-6 w-6 text-semantic-error" />
                  Delete Column
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the column{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      "{columnTitle}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={onClose} className="btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={countdown > 0 || isDeleting}
                    className={`btn bg-semantic-error text-button-primary-text hover:bg-semantic-error focus:ring-semantic-error dark:bg-semantic-error dark:hover:bg-semantic-error/80 ${
                      countdown > 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-semantic-error/90"
                    }`}
                  >
                    {isDeleting
                      ? "Deleting..."
                      : countdown > 0
                      ? `Delete (${countdown}s)`
                      : "Delete"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
