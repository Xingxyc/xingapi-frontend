import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';

export type UpdateFormProps = {
  values: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<void>;
  updateModalOpen: boolean;
};

const UpdateModal: React.FC<UpdateFormProps> = (props) => {
  const { columns, updateModalOpen, onSubmit, onCancel, values } = props;

  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values]);
  return (
    <Modal open={updateModalOpen} footer={null} onCancel={onCancel}>
      <ProTable
        formRef={formRef}
        columns={columns}
        type="form"
        onSubmit={async (value) => {
          onSubmit?.(value);
        }}
      ></ProTable>
    </Modal>
  );
};

export default UpdateModal;
