import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  AudioOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import UsersPage from "./screens/users.page.tsx";
import App from "./App.tsx";
import "./App.scss";
import TrackPage from "./screens/tracks.page.tsx";
import CommentPage from "./screens/comments.page.tsx";

const items: MenuProps["items"] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to={"/users"}>Mange Users</Link>,
    key: "users",
    icon: <UserOutlined />,
  },
  {
    label: <Link to={"/tracks"}>Mange Tracks</Link>,
    key: "tracks",
    icon: <AudioOutlined />,
  },
  {
    label: <Link to={"/comments"}>Mange Comments</Link>,
    key: "comments",
    icon: <CommentOutlined />,
  },
];

const Header = () => {
  const [current, setCurrent] = useState("home");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

const LayoutAdmin = () => {
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: "admin@gmail.com",
        password: "123456",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const d = await res.json();
    if (d.data) localStorage.setItem("access_token", d.data.access_token);
  };

  return (
    <div>
      <Header />
      <Outlet />
      <footer></footer>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,

    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "tracks",
        element: <TrackPage />,
      },
      {
        path: "comments",
        element: <CommentPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
