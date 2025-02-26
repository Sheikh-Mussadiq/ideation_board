import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Check, UserMinus } from 'lucide-react';

export default function AssigneeModal({ isOpen, onClose, users, currentAssignees = [], onAssign }) {
  const [localAssignees, setLocalAssignees] = useState(currentAssignees);

  // Reset local state when modal opens with new currentAssignees
  useEffect(() => {
    setLocalAssignees(currentAssignees);
  }, [currentAssignees, isOpen]);

  const isAssigned = (userId) => localAssignees.some(assignee => assignee._id === userId);

  const handleUserClick = (user) => {
    const newAssignees = isAssigned(user._id)
      ? localAssignees.filter(assignee => assignee._id !== user._id)
      : [...localAssignees, user];
    setLocalAssignees(newAssignees);
  };

  const handleClose = () => {
    // Only update in Supabase if there are actual changes
    if (JSON.stringify(localAssignees) !== JSON.stringify(currentAssignees)) {
      onAssign(localAssignees);
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-design-black">
                    Assign Users ({localAssignees.length} selected)
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="p-2 text-design-primaryGrey hover:text-primary rounded-full hover:bg-primary-light transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Preview of selected users */}
                {localAssignees.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2 bg-primary-light/50 p-3 rounded-lg">
                    {localAssignees.map((assignee) => (
                      <div
                        key={assignee._id}
                        className="flex items-center gap-2 bg-white rounded-full pl-1 pr-2 py-1"
                      >
                        <div className="h-6 w-6 rounded-full bg-design-primaryPurple text-white flex items-center justify-center text-xs">
                          {assignee.firstName[0]}
                          {assignee.lastName[0]}
                        </div>
                        <span className="text-xs text-design-primaryGrey">
                          {assignee.firstName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-primary-light transition-all group ${
                        isAssigned(user._id) ? 'bg-primary-light' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-design-primaryPurple text-white flex items-center justify-center">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-design-black">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-design-primaryGrey">{user.email}</p>
                        </div>
                      </div>
                      {isAssigned(user._id) ? (
                        <UserMinus className="h-5 w-5 text-semantic-error" />
                      ) : (
                        <Check className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Footer with action buttons */}
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setLocalAssignees([])}
                    className="btn-ghost text-semantic-error"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleClose}
                    className="btn-primary"
                  >
                    Save Changes
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
