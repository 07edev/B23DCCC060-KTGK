import React from 'react';
import { Layout } from 'antd';
import ClassroomList from '@/components/ClassroomList';

const { Content } = Layout;

const QuanLyPhongHoc: React.FC = () => {
  return (
    <Layout>
      <Content style={{ padding: '24px', minHeight: '100vh' }}>
        <ClassroomList />
      </Content>
    </Layout>
  );
};

export default QuanLyPhongHoc; 