import { useState, useEffect } from "react";
import axios from "axios";

const usePostData = (url, postData = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postDataAsync = async () => {
      try {
        const response = await axios.post(url, postData, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    if (postData) {
      postDataAsync();
    }
  }, [url, postData]);

  return { data, error };
};

export default usePostData;
