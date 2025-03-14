import { Fragment, useState } from "react";
import { X, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSocialIcon } from "../utils/socialIcons";
import { useScrollLock } from "../hooks/useScrollLock";

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

export default function ShareChannelModal({
  isOpen,
  onClose,
  channels,
  activeChannelIds,
  onShare,
}) {
  useScrollLock(isOpen);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const handleChannelToggle = (channelId) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
    console.log(selectedChannels);
  };

  const handleShare = () => {
    onShare(selectedChannels);
    onClose();
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Select Channels to Share
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {channels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Share2 className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center mb-2">
                  No channels available
                </p>
                <p className="text-gray-400 text-sm text-center">
                  Please add some channels to start sharing your content
                </p>
              </div>
            ) : (
              <div className="grid gap-3 mb-6 max-h-[60vh] overflow-y-auto">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => handleChannelToggle(channel.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer border transition-all ${
                      selectedChannels.includes(channel.id)
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
                      <span className="font-medium">
                        {channel.socialNetwork
                          .replace(/_/g, " ")
                          .split(" ")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </span>
                    </div>
                    <img
                      src={getSocialIcon(channel.socialNetwork)}
                      alt={`${channel.socialNetwork} icon`}
                      className="w-8 h-8 object-contain"
                    />
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
                Share
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
