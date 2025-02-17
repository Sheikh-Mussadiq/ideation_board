"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteBoardModal({
  isOpen,
  onClose,
  onConfirm,
  boardTitle,
}) {
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
          <div className="fixed inset-0 bg-design-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="card w-full max-w-md transform overflow-hidden p-6 text-left align-middle transition-all">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={onClose}
                    className="btn-ghost hover:bg-semantic-error-light p-2 rounded-full hover:rotate-90 transition-transform"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-semantic-error dark:text-semantic-error" />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-design-black dark:text-design-white"
                  >
                    Delete Board
                  </Dialog.Title>
                </div>

                <div className="mt-3 text-center sm:mt-0 sm:text-left animate-in slide-in-from-top">
                  <div className="mt-2">
                    <p className="text-sm text-design-primaryGrey dark:text-design-greyOutlines leading-relaxed">
                      Are you sure you want to delete the board "{boardTitle}"?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="btn bg-semantic-error text-button-primary-text hover:bg-semantic-error focus:ring-semantic-error dark:bg-semantic-error dark:hover:bg-semantic-error/80"
                  >
                    Delete
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
