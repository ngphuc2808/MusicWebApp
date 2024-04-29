import { useEffect, useState } from "react";

import { Table, Button, Popconfirm, notification, message } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

export interface iTracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
}

const TracksTable = () => {
  const [listTracks, setListTracks] = useState([]);
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
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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

    setListTracks(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  const confirm = async (track: iTracks) => {
    const res1 = await fetch(
      `http://localhost:8000/api/v1/tracks/${track._id}`,
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

  const column: ColumnsType<iTracks> = [
    {
      title: "STT",
      dataIndex: "_id",
      render: (_, record, index) => {
        return <>{(meta.current - 1) * meta.pageSize + index + 1}</>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "TrackUrl",
      dataIndex: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"],
    },
    {
      title: "Actions",
      render: (_, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete a track"
              description={`Are you sure to delete this track. title = ${record.title} ?`}
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
      `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
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

    setListTracks(d1.data.result);
    setMeta({
      current: d1.data.meta.current,
      pageSize: d1.data.meta.pageSize,
      pages: d1.data.meta.pages,
      total: d1.data.meta.total,
    });
  };

  return (
    <div>
      <h2>Table Tracks</h2>
      <Table
        columns={column}
        dataSource={listTracks}
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

export default TracksTable;
