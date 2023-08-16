import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { theme } from 'antd';
import React from 'react';

const Index: React.FC = () => {
  const { token } = theme.useToken();
  const { initialState } = useModel('@@initialState');
  return <PageContainer title="在线接口开放平台"></PageContainer>;
};

export default Index;
