import { useEffect, useState } from "react";

import { Table, Button, Popconfirm, notification, message } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

export interface iComments {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  } | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

const CommentsTable = () => {
  const [listComments, setListComments] = useState([]);
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
      `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
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

    setListComments(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  const confirm = async (comment: iComments) => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/comments/${comment._id}`,
      {
        method: "DELETE",
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
    } else {
      notification.success({
        message: "Xóa bài hát thành công",
      });
      await getData();
    }
  };

  const cancel = () => {
    message.error("Click on No");
  };

  const column: ColumnsType<iComments> = [
    {
      title: "STT",
      dataIndex: "_id",
      render: (_, record, index) => {
        return <>{(meta.current - 1) * meta.pageSize + index + 1}</>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Track",
      dataIndex: ["track", "title"],
    },
    {
      title: "User",
      dataIndex: ["user", "email"],
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete a comment"
              description={`Are you sure to delete this comment. content = ${record.content} ?`}
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
      `http://localhost:8000/api/v1/comments?current=${page}&pageSize=${pageSize}`,
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

    setListComments(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  return (
    <div>
      <h2>Table Comments</h2>
      <Table
        columns={column}
        dataSource={listComments}
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
    </div>
  );
};

export default CommentsTable;
