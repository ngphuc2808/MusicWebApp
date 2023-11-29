import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, notification } from "antd";
import { iUser } from "./users.table";

const { Option } = Select;

interface IProps {
  getData: any;
  token: string;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  dataUpdate: null | iUser;
  setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
  const {
    getData,
    token,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm<iUser>();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        email: dataUpdate.email,
        age: dataUpdate.age,
        address: dataUpdate.address,
        gender: dataUpdate.gender,
        role: dataUpdate.role,
      });
    }
  }, [dataUpdate]);

  const onFinish = async (values: iUser) => {
    if (dataUpdate) {
      const data = values;

      data._id = dataUpdate._id;

      const res = await fetch("http://localhost:8000/api/v1/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const d = await res.json();
      if (d.data) {
        await getData();
        notification.success({
          message: "Cập nhật user thành công",
        });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    }
  };

  const handleCloseCreateModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setDataUpdate(null);
  };

  return (
    <Modal
      title="Update a user"
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
    >
      <Form form={form} name="basic" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: dataUpdate ? false : true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password disabled={dataUpdate ? true : false} />
        </Form.Item>
        <Form.Item
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <InputNumber
            min={0}
            max={100}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="MALE">male</Option>
            <Option value="FEMALE">female</Option>
            <Option value="OTHER">other</Option>
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Role" rules={[{ required: true }]}>
          <Select
            placeholder="Select a option and change input text above"
            allowClear
          >
            <Option value="USER">user</Option>
            <Option value="ADMIN">admin</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
