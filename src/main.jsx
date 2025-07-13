import { createRoot } from 'react-dom/client'
import './index.css'
import Movies from './Movies.jsx'
import TVshows from './TVshows.jsx';
import People from './People.jsx';
import Landing from './Landing.jsx';
import Layout from './Layout.jsx';
import ShowCard from './Components/ShowCard.jsx';
import SearchResults from './SearchResults.jsx';
import Personalize from './Components/Personalize.jsx';
import { createHashRouter, RouterProvider } from "react-router-dom";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path:"/search/:query",
        element:<SearchResults />,
      },
      {
        path: "/Movies",
        element: <Movies></Movies>,
      },
      {
        path: "TVshows",
        element:<TVshows></TVshows>,
      },
      {
        path: "People",
        element: <People></People>,
      },
      {
        path: "ShowCard",
        element: <ShowCard></ShowCard>,
      },
      {
        path: "Personalize",
        element: <Personalize></Personalize>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
