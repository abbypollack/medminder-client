import { useState } from 'react';
import axios from 'axios';

function useAutocomplete(baseUrl) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}?terms=${encodeURIComponent(input)}`);
      setSuggestions(response.data[3].map((item, index) => ({
        name: item[0],
        rxNormId: response.data[1][index],
      })));
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, fetchSuggestions, loading };
};

export default useAutocomplete;
