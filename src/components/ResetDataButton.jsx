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
      className="fixed bottom-4 right-4 btn-primary disabled:opacity-50 hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : 'group-hover:rotate-180 transition-transform'}`} />
      {isResetting ? 'Wird zurückgesetzt...' : 'Daten zurücksetzen'}
    </button>
  );
}