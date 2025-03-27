import { Fragment, useState, useEffect } from "react";
import { X, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialIcon } from "../utils/socialIcons";
import { useScrollLock } from "../hooks/useScrollLock";
import Translate from "./Translate";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// Add this helper function at the top of the component
const getChannelId = (channel) => channel.id || channel._id;

export default function ShareChannelModal({
  isOpen,
  onClose,
  channels,
  activeChannelIds,
  onShare,
}) {
  useScrollLock(isOpen);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const handleChannelToggle = (channel) => {
    const channelId = getChannelId(channel);
    setSelectedChannels((prev) => {
      if (prev.includes(channelId)) {
        return prev.filter((id) => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  useEffect(() => {
    console.log(activeChannelIds, channels, selectedChannels);
  }, [selectedChannels]);

  const handleShare = () => {
    if (selectedChannels.length > 0) {
      onShare(selectedChannels);
      onClose();
      setSelectedChannels([]); // Reset selection after sharing
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-x-0 top-48 flex items-start justify-center z-[200] mt-4">
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          />

          <motion.div
            className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl relative z-[201]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-medium text-gray-900">
                <Translate>Select Channels to Share</Translate>
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-900 mb-3">
              <Translate>
                This will create a draft in the content planner for the selected
                cahnnels in SocialHub
              </Translate>
            </p>
            {channels && channels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Share2 className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center mb-2">
                  <Translate>No channels available</Translate>
                </p>
                <p className="text-gray-400 text-sm text-center">
                  <Translate>
                    Please add some channels to start sharing your content
                  </Translate>
                </p>
              </div>
            ) : (
              <div className="grid gap-3 mb-6 max-h-[60vh] overflow-y-auto">
                {channels &&
                  channels.map((channel) => (
                    <div
                      key={getChannelId(channel)}
                      onClick={() => handleChannelToggle(channel)}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                        selectedChannels.includes(getChannelId(channel))
                          ? "bg-design-lightPurpleButtonFill border-primary"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={channel.imageUrl}
                          alt={channel.socialNetwork}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {channels.filter(
                              (c) =>
                                c.name === channel.name &&
                                c.socialNetwork === channel.socialNetwork
                            ).length > 1
                              ? channel.uniqueName || channel.name
                              : channel.name}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={getSocialIcon(channel.socialNetwork)}
                          alt={`${channel.socialNetwork} icon`}
                          className="w-7 h-7 object-contain"
                        />
                        <div className="px-2 py-0.5 text-xs font-medium bg-gray-100 rounded-full">
                          {channel.socialNetwork}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleShare}
                disabled={selectedChannels.length === 0}
                className="btn-primary"
              >
                <Translate>Share</Translate>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
