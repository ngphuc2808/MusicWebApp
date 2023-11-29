import { useEffect, useState } from "react";

import { Table, Button, Popconfirm, notification, message } from "antd";
import { PlusOutlined, EditFilled, DeleteFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import CreateUserModal from "./create.users.modal";
import UpdateUserModal from "./update.users.modal";

export interface iUser {
  _id: string;
  name: string;
  email: string;
  gender: string;
  address: string;
  age: string;
  role: string;
}
const UsersTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | iUser>(null);
  const [listUsers, setListUsers] = useState([]);
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const access_token = localStorage.getItem("access_token") as string;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d1 = await res1.json();

    if (!d1.data) {
      notification.error({
        message: JSON.stringify(d1.message),
      });
    }

    setListUsers(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  const confirm = async (user: iUser) => {
    const res1 = await fetch(`http://localhost:8000/api/v1/users/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });

    const d1 = await res1.json();

    if (!d1.data) {
      notification.error({
        message: JSON.stringify(d1.message),
      });
    } else {
      notification.success({
        message: "Xóa user thành công",
      });
      await getData();
    }
  };

  const cancel = () => {
    message.error("Click on No");
  };

  const column: ColumnsType<iUser> = [
    {
      title: "Email",
      dataIndex: "email",
      render: (_, record) => {
        return <div>{record.email}</div>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Button
              icon={<EditFilled />}
              onClick={() => {
                setDataUpdate(record);
                setIsUpdateModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete a user"
              description={`Are you sure to delete this user. name = ${record.name} ?`}
              onConfirm={() => confirm(record)}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ marginLeft: "10px" }}
                danger
                icon={<DeleteFilled />}
              >
                Delete
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const handleChangePage = async (page: number, pageSize: number) => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const d1 = await res1.json();

    if (!d1.data) {
      notification.error({
        message: JSON.stringify(d1.message),
      });
    }

    setListUsers(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Table Users</h2>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add new
          </Button>
        </div>
      </div>
      <Table
        columns={column}
        dataSource={listUsers}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) =>
            handleChangePage(page, pageSize),
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      <CreateUserModal
        getData={getData}
        token={access_token}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateUserModal
        getData={getData}
        token={access_token}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default UsersTable;
