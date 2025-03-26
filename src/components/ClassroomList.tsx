import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Modal,
  message,
  Card,
  Row,
  Col,
  Form,
  InputNumber,
  Alert,
  Popconfirm,
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Classroom, RoomType } from '@/models/classroom';
import useClassroomModel from '@/models/useClassroomModel';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

const ROOM_TYPES: RoomType[] = ['Lý thuyết', 'Thực hành', 'Hội trường'];

const ClassroomList: React.FC = () => {
  const {
    state: { classrooms, loading, error },
    effects: { fetchClassrooms, addClassroom, updateClassroom, deleteClassroom },
  } = useClassroomModel();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [roomType, setRoomType] = useState<RoomType | 'all'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        await fetchClassrooms();
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [fetchClassrooms]);

  const showModal = useCallback((record?: Classroom) => {
    console.log('showModal called with:', record);
    if (record) {
      setEditingClassroom(record);
      form.setFieldsValue(record);
    } else {
      setEditingClassroom(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  }, [form]);

  const handleAddClick = useCallback(() => {
    console.log('Add button clicked');
    showModal();
  }, [showModal]);

  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      console.log('Form values:', values);

      if (editingClassroom) {
        await updateClassroom(editingClassroom.id, values);
      } else {
        await addClassroom(values);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingClassroom(null);
    } catch (error) {
      console.error('Form error:', error);
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu phòng học');
    }
  }, [editingClassroom, form, addClassroom, updateClassroom]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingClassroom(null);
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteClassroom(id);
      message.success('Xóa phòng học thành công');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa phòng học');
    }
  }, [deleteClassroom]);

  const columns: ColumnsType<Classroom> = [
    {
      title: 'Mã phòng',
      dataIndex: 'code',
      key: 'code',
      sorter: (a: Classroom, b: Classroom) => a.code.localeCompare(b.code),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Classroom, b: Classroom) => a.name.localeCompare(b.name),
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'capacity',
      key: 'capacity',
      sorter: (a: Classroom, b: Classroom) => a.capacity - b.capacity,
      sortOrder,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      filters: ROOM_TYPES.map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa phòng học này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
            placement="top"
            overlayStyle={{ width: 300 }}
            okButtonProps={{ danger: true }}
            showCancel
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleTypeChange = useCallback((value: RoomType | 'all') => {
    setRoomType(value);
  }, []);

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch =
      classroom.code.toLowerCase().includes(searchText.toLowerCase()) ||
      classroom.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = roomType === 'all' || classroom.type === roomType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <Card title="Quản lý Phòng học">
        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Search
              placeholder="Tìm kiếm theo mã hoặc tên phòng"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Col>
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Lọc theo loại phòng"
              value={roomType}
              onChange={handleTypeChange}
            >
              <Option value="all">Tất cả</Option>
              {ROOM_TYPES.map(type => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddClick}
              style={{ width: '100%' }}
            >
              Thêm phòng học
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredClassrooms}
          rowKey="id"
          loading={loading}
          onChange={(_, __, sorter: any) => {
            setSortOrder(sorter.order);
          }}
          pagination={{
            total: filteredClassrooms.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingClassroom ? 'Sửa phòng học' : 'Thêm phòng học mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
        width={600}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ capacity: 30 }}
          preserve={false}
        >
          <Form.Item
            name="code"
            label="Mã phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập mã phòng' },
              { max: 10, message: 'Mã phòng không được vượt quá 10 ký tự' },
            ]}
          >
            <Input placeholder="Nhập mã phòng" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng' },
              { max: 50, message: 'Tên phòng không được vượt quá 50 ký tự' },
            ]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
              { type: 'number', min: 1, message: 'Số chỗ ngồi phải lớn hơn 0' },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số chỗ ngồi" />
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

          <Form.Item
            name="manager"
            label="Người phụ trách"
            rules={[{ required: true, message: 'Vui lòng nhập người phụ trách' }]}
          >
            <Input placeholder="Nhập tên người phụ trách" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassroomList; 