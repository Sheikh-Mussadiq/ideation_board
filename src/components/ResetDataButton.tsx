import React from 'react';
import { RefreshCw } from 'lucide-react';
import { seedKanbanData } from '../utils/seedData';
import toast from 'react-hot-toast';

export default function ResetDataButton() {
  const [isResetting, setIsResetting] = React.useState(false);

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const { success, error } = await seedKanbanData();
      
      if (success) {
        toast.success('Daten wurden zurückgesetzt');
        window.location.reload();
      } else {
        throw error;
      }
    } catch (error) {
      console.error('Error resetting data:', error);
      toast.error('Fehler beim Zurücksetzen der Daten');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <button
      onClick={handleReset}
      disabled={isResetting}
      className="fixed bottom-4 right-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
      {isResetting ? 'Wird zurückgesetzt...' : 'Daten zurücksetzen'}
    </button>
  );
}