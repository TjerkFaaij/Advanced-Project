import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { eventLoader, EventPage } from "./pages/EventPage";
import { NewEventPage } from "./pages/NewEventPage";
import { EventsPage, loader as eventsLoader } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <EventsPage />,
        loader: eventsLoader,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        loader: eventLoader,
        // action: addComment,
      },
      {
        path: "event/new",
        element: <NewEventPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
