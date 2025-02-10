import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter, X } from 'lucide-react';
import Header from '../components/Header';

const POST_TYPES = ['POST', 'COMMENT', 'THREAD', 'MESSAGE', 'RATING', 'TICKET'];
const STATUS_OPTIONS = ['published', 'draft', 'scheduled'];

export default function ContentSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    try {
      const allContent = await fetchContent();
      const filtered = allContent.filter(content => {
        const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            content.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(content.type);
        const matchesStatus = selectedStatus.length === 0 || selectedStatus.includes(content.status);
        const matchesDate = (!dateRange.from || new Date(content.createdAt) >= new Date(dateRange.from)) &&
                          (!dateRange.to || new Date(content.createdAt) <= new Date(dateRange.to));

        return matchesSearch && matchesType && matchesStatus && matchesDate;
      });

      setResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedStatus([]);
    setDateRange({ from: '', to: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/content"
            className="btn-ghost btn-sm rounded-full group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Content List
          </Link>
        </div>

        <div className="card animate-in fade-in-50">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Content</h1>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-primary" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by title or content..."
                      className="input pl-10"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="btn-primary"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              <div className="bg-primary-light p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  {(selectedTypes.length > 0 || selectedStatus.length > 0 || dateRange.from || dateRange.to) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm text-primary hover:text-primary-hover flex items-center group"
                    >
                      <X className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <div className="space-y-2">
                      {POST_TYPES.map(type => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="space-y-2">
                      {STATUS_OPTIONS.map(status => (
                        <label key={status} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStatus.includes(status)}
                            onChange={() => toggleStatus(status)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={dateRange.from}
                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                        className="input"
                      />
                      <input
                        type="date"
                        value={dateRange.to}
                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {results.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Search Results</h2>
                <div className="overflow-hidden shadow-lg ring-1 ring-primary ring-opacity-5 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {results.map((item) => (
                        <tr key={item.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <Link to={`/content/${item.id}`} className="text-indigo-600 hover:text-indigo-900">
                              {item.title}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.type}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              item.status === 'published' ? 'bg-semantic-success-light text-semantic-success' :
                              item.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                              'bg-semantic-warning-light text-semantic-warning'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ContentSearchPage.propTypes = {
  // No props needed as this is a top-level page component
};