import { useState, useEffect } from "react";
import axios from "axios";

// function takes an api url and returns the data
const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          responseType: "json",
          withCredentials: true,
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [url]);

  return { data };
};

export default useFetchData;

// to use this in another component:
// import useFetchData from "./useFetchData";

// const MyPage = () => {
//   const { data, isLoading, error } = useFetchData(
//     "http://localhost:8080/api/service-requests/user-requests"
//   );

//   // Render loading or error state if necessary
//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   // Render your component with the fetched data
//   return <div>{/* Render your component with the fetched data */}</div>;
// };
