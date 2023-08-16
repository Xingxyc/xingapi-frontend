import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export type CreateFormProps = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  createModalOpen: boolean;
};

const CreateModal: React.FC<CreateFormProps> = (props) => {
  const { columns, createModalOpen, onSubmit, onCancel } = props;
  return (
    <Modal open={createModalOpen} footer={null} onCancel={onCancel} destroyOnClose={true}>
      <ProTable
        columns={columns}
        type="form"
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      ></ProTable>
    </Modal>
  );
};

export default CreateModal;
