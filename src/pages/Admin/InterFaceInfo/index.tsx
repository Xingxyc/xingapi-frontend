import CreateModal from '@/pages/Admin/InterFaceInfo/components/CreateModal';
import UpdateModal from '@/pages/Admin/InterFaceInfo/components/UpdateModal';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/xingapi-backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  /**
   *  online node
   * @zh-CN 上线
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    const hide = message.loading('正在发布~');
    if (!record) return true;
    try {
      await onlineInterfaceInfoUsingPOST({ id: record.id });
      hide();
      message.success('发布成功~');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  /**
   *  offline node
   * @zh-CN 下线
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    const hide = message.loading('正在下线~');
    if (!record) return true;
    try {
      await offlineInterfaceInfoUsingPOST({ id: record.id });
      hide();
      message.success('下线成功~');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param record
   */
  const handleRemove = async (record: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfoUsingPOST({ id: record.id });
      hide();
      message.success('Deleted successfully and will refresh soon');
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在修改');
    if (!currentRow) {
      return;
    }
    try {
      await updateInterfaceInfoUsingPOST({
        id: currentRow.id,
        ...fields,
      });
      hide();

      message.success('操作成功~');
      return true;
    } catch (error) {
      hide();
      message.error('Configuration failed, please try again!');
      return false;
    }
  };

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPOST({ ...fields });
      hide();
      message.success('Added successfully');
      handleModalOpen(false);
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="text"
          key="config"
          size="small"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </Button>,
        record.status === 0 ? (
          <Button
            type="text"
            key="config"
            size="small"
            onClick={() => {
              handleOnline(record);
            }}
          >
            发布
          </Button>
        ) : (
          <Button
            type="text"
            key="config"
            danger
            size="small"
            onClick={() => {
              handleOffline(record);
            }}
          >
            下线
          </Button>
        ),
        <Button
          type="text"
          key="config"
          danger
          size="small"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params) => {
          const res = await listInterfaceInfoByPageUsingGET({ ...params });
          if (res?.data) {
            return {
              data: res?.data.records,
              success: true,
              total: res?.data.total,
            };
          } else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
              <span>
                <FormattedMessage
                  id="pages.searchTable.totalServiceCalls"
                  defaultMessage="Total number of service calls"
                />{' '}
                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)}{' '}
                <FormattedMessage id="pages.searchTable.tenThousand" defaultMessage="万" />
              </span>
            </div>
          }
        >
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <UpdateModal
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        columns={columns}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      <CreateModal
        columns={columns}
        onCancel={() => {
          handleModalOpen(false);
        }}
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        createModalOpen={createModalOpen}
      ></CreateModal>
    </PageContainer>
  );
};

export default TableList;
