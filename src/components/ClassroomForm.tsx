import React from 'react';
import { Form, Input, InputNumber, Select, Button, Space, message } from 'antd';
import { Classroom, RoomType } from '@/models/classroom';

const { Option } = Select;

interface ClassroomFormProps {
  initialValues?: Classroom;
  onSubmit: (values: Omit<Classroom, 'id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ROOM_TYPES: RoomType[] = ['Lý thuyết', 'Thực hành', 'Hội trường'];

// Danh sách người phụ trách mẫu
const MANAGERS = [
  'Nguyễn Văn A',
  'Trần Thị B',
  'Lê Văn C',
  'Phạm Thị D',
  'Hoàng Văn E',
];

const ClassroomForm: React.FC<ClassroomFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    console.log('Form submitted with values:', values);
    try {
      await onSubmit(values);
      message.success('Lưu thành công');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      autoComplete="off"
    >
      <Form.Item
        name="code"
        label="Mã phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập mã phòng' },
          { max: 10, message: 'Mã phòng không được vượt quá 10 ký tự' },
        ]}
      >
        <Input 
          placeholder="Nhập mã phòng" 
          maxLength={10}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên phòng"
        rules={[
          { required: true, message: 'Vui lòng nhập tên phòng' },
          { max: 50, message: 'Tên phòng không được vượt quá 50 ký tự' },
        ]}
      >
        <Input 
          placeholder="Nhập tên phòng" 
          maxLength={50}
          showCount
        />
      </Form.Item>

      <Form.Item
        name="manager"
        label="Người phụ trách"
        rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
      >
        <Select placeholder="Chọn người phụ trách">
          <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
          <Option value="Trần Thị B">Trần Thị B</Option>
          <Option value="Lê Văn C">Lê Văn C</Option>
          <Option value="Phạm Thị D">Phạm Thị D</Option>
          <Option value="Hoàng Văn E">Hoàng Văn E</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="capacity"
        label="Số chỗ ngồi"
        rules={[
          { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
          { type: 'number', min: 1, message: 'Số chỗ ngồi phải lớn hơn 0' },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="Nhập số chỗ ngồi"
          min={1}
        />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại phòng"
        rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
      >
        <Select placeholder="Chọn loại phòng">
          {ROOM_TYPES.map(type => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={onCancel}>Hủy</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ClassroomForm; 