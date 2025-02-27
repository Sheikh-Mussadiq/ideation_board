import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  X,
  Clock,
  History,
  ArrowUpRight,
  Filter,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  ChevronDown,
  Search,
} from "lucide-react";
import { fetchBoardLogs } from "../services/boardService";
import { formatDistanceToNow } from "date-fns";

const LogShimmer = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 items-start">
        <div className="w-10 h-10 bg-design-greyBG dark:bg-design-black/50 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-design-greyBG dark:bg-design-black/50 rounded-lg w-3/4"></div>
          <div className="h-3 bg-design-greyBG dark:bg-design-black/50 rounded-lg w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

const processLogMessage = (log) => {
  if (!log || !log.message) {
    return null;
  }

  if (
    log.message.includes("Changed fields: updated_at") &&
    !log.message.includes(",")
  ) {
    return null;
  }

  if (log.message.includes(", updated_at")) {
    return {
      ...log,
      message: log.message.replace(", updated_at", ""),
    };
  }

  if (log.message.includes("updated_at, ")) {
    return {
      ...log,
      message: log.message.replace("updated_at, ", ""),
    };
  }

  return log;
};

const getEventIcon = (eventType) => {
  switch (eventType) {
    case "INSERT":
      return <Plus className="h-4 w-4" />;
    case "UPDATE":
      return <Pencil className="h-4 w-4" />;
    case "DELETE":
      return <Trash2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getEventColor = (eventType) => {
  switch (eventType) {
    case "INSERT":
      return "bg-semantic-success-light text-semantic-success dark:bg-semantic-success/20";
    case "UPDATE":
      return "bg-button-primary-cta/10 text-button-primary-cta dark:bg-button-primary-cta/20";
    case "DELETE":
      return "bg-semantic-error-light text-semantic-error dark:bg-semantic-error/20";
    default:
      return "bg-design-primaryPurple/10 text-design-primaryPurple";
  }
};

const filterOptions = [
  { id: "all", name: "All Activities", icon: Clock },
  { id: "INSERT", name: "Created", icon: Plus },
  { id: "UPDATE", name: "Updated", icon: Pencil },
  { id: "DELETE", name: "Deleted", icon: Trash2 },
];

export default function BoardLogs({ isOpen, setIsOpen, board }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'INSERT', 'UPDATE', 'DELETE'
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLogs() {
      if (isOpen && board.id) {
        setLoading(true);
        try {
          const boardLogs = await fetchBoardLogs(board.id);
          const processedLogs = boardLogs
            .map(processLogMessage)
            .filter(Boolean);
          setLogs(processedLogs);
        } catch (error) {
          console.error("Error fetching logs:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadLogs();
  }, [isOpen, board]);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === "all" || log.event_type === filter;
    const matchesSearch = log.message
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-design-black/25 backdrop-blur-sm transition-opacity" />
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
                  <div className="flex h-full flex-col rounded-l-3xl overflow-y-scroll bg-white dark:bg-design-black shadow-xl">
                    <div className="sticky top-0 z-10 bg-white dark:bg-design-black border-b border-design-greyOutlines dark:border-design-greyOutlines/20 p-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold flex items-center gap-2 text-design-black dark:text-design-white">
                          <History className="h-5 w-5 text-design-primaryPurple" />
                          Activity Log
                        </Dialog.Title>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="rounded-lg p-2 text-design-primaryGrey hover:text-semantic-error hover:bg-semantic-error-light transition-all duration-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* New Filter Dropdown */}
                      <div className="mt-4">
                        <Listbox value={filter} onChange={setFilter}>
                          <div className="relative">
                            <Listbox.Button className="relative w-full flex items-center gap-2 text-left bg-design-greyBG dark:bg-design-black border border-design-greyOutlines dark:border-design-greyOutlines/20 rounded-xl px-4 py-2.5 hover:bg-design-greyBG/80 dark:hover:bg-design-black/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-design-primaryPurple">
                              <Filter className="h-4 w-4 text-design-primaryGrey" />
                              <span className="block truncate text-sm">
                                {
                                  filterOptions.find(
                                    (option) => option.id === filter
                                  )?.name
                                }
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <ChevronDown
                                  className="h-4 w-4 text-design-primaryGrey transition-transform duration-200 ui-open:rotate-180"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>
                            <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute mt-1 w-full overflow-hidden bg-white dark:bg-design-black border border-design-greyOutlines dark:border-design-greyOutlines/20 rounded-xl py-1 shadow-lg focus:outline-none z-50">
                                {filterOptions.map((option) => (
                                  <Listbox.Option
                                    key={option.id}
                                    className={({ active, selected }) =>
                                      `relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors duration-200 ${
                                        active
                                          ? "bg-design-primaryPurple/5 dark:bg-design-primaryPurple/10"
                                          : ""
                                      } ${
                                        selected
                                          ? "text-design-primaryPurple"
                                          : "text-design-black dark:text-design-white"
                                      }`
                                    }
                                    value={option.id}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span className="flex items-center gap-2">
                                          <option.icon
                                            className={`h-4 w-4 ${
                                              selected
                                                ? "text-design-primaryPurple"
                                                : "text-design-primaryGrey"
                                            }`}
                                          />
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {option.name}
                                          </span>
                                        </span>
                                        {selected && (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-design-primaryPurple">
                                            <CheckCircle2
                                              className="h-4 w-4"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      </div>

                      {/* Search Input */}
                      <div className="mt-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-design-primaryGrey" />
                        </div>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search activity logs..."
                          className="w-full pl-10 pr-4 py-2.5 bg-design-greyBG dark:bg-design-black border border-design-greyOutlines dark:border-design-greyOutlines/20 rounded-xl text-sm text-design-black dark:text-design-white placeholder-design-primaryGrey focus:outline-none focus:ring-2 focus:ring-design-primaryPurple transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="flex-1 p-6">
                      {loading ? (
                        <LogShimmer />
                      ) : filteredLogs.length === 0 ? (
                        <div className="text-center text-design-primaryGrey dark:text-design-greyOutlines mt-8">
                          No activity logs found
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredLogs.map((log) => (
                            <div
                              key={log.id}
                              className="group flex gap-4 items-start p-4 rounded-xl bg-design-greyBG/30 dark:bg-design-black/30 hover:bg-design-primaryPurple/5 transition-all duration-200"
                            >
                              <div
                                className={`mt-1 p-2 rounded-xl ${getEventColor(
                                  log.event_type
                                )} transition-colors`}
                              >
                                {getEventIcon(log.event_type)}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-design-black dark:text-design-white group-hover:text-design-primaryPurple transition-colors">
                                  {log.message}
                                </p>
                                <p className="text-xs text-design-primaryGrey dark:text-design-greyOutlines mt-1 flex items-center gap-1">
                                  <ArrowUpRight className="h-3 w-3" />
                                  {formatDistanceToNow(
                                    new Date(log.created_at),
                                    { addSuffix: true }
                                  )}
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
