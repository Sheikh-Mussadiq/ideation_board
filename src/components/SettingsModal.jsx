import React, { useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X, User, Mail, Shield, Hash, Bell } from "lucide-react";
import { updateUserData } from "../services/userService";

const UserDetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-design-greyBG/50 hover:bg-design-greyBG/70 rounded-xl transition-all">
    <Icon className="w-5 h-5 text-design-primaryPurple" />
    <div>
      <p className="text-sm text-design-primaryGrey">{label}</p>
      <p className="font-medium text-design-black dark:text-white">{value}</p>
    </div>
  </div>
);

export default function SettingsModal({ isOpen, onClose, user, userId }) {
  const [emailNotifications, setEmailNotifications] = useState(user?.email_preferance);

  const handleNotificationToggle = async (checked) => {
    setEmailNotifications(checked);
    await updateUserData(checked, userId);
  };
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-design-black p-6 shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-xl font-semibold text-design-black dark:text-white">
                    Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-design-greyBG rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-design-primaryGrey" />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <UserDetailItem
                    icon={User}
                    label="Full Name"
                    value={`${user.firstName} ${user.lastName}`}
                  />
                  {/* <UserDetailItem
                    icon={User}
                    label="Username"
                    value={user.username}
                  /> */}
                  <UserDetailItem
                    icon={Mail}
                    label="Email"
                    value={user.email}
                  />
                  <UserDetailItem
                    icon={Shield}
                    label="Role"
                    value={user.role || "User"}
                  />
                  <UserDetailItem
                    icon={Hash}
                    label="User ID"
                    value={user.userId}
                  />

                  {/* Notification Toggle */}
                  <div className="flex items-center justify-between p-3 bg-design-greyBG/50 hover:bg-design-greyBG/70 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-design-primaryPurple" />
                      <div>
                        <p className="font-medium text-design-black dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-design-primaryGrey">
                          Receive email updates
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onChange={handleNotificationToggle}
                      className={`${
                        emailNotifications
                          ? "bg-design-primaryPurple"
                          : "bg-design-greyOutlines"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-design-primaryPurple focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          emailNotifications ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
