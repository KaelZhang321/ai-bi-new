import React, { useEffect, useState } from 'react'
import { Modal, Table, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { theme } from '../../styles/theme'

interface DrillDownModalProps<T> {
  open: boolean
  title: string
  onClose: () => void
  fetchData: () => Promise<T[]>
  columns: ColumnsType<T>
  rowKey: string | ((record: T) => string)
}

function DrillDownModal<T extends object>({ open, title, onClose, fetchData, columns, rowKey }: DrillDownModalProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      fetchData()
        .then(setData)
        .catch(() => setData([]))
        .finally(() => setLoading(false))
    } else {
      setData([])
    }
  }, [open, fetchData])

  return (
    <Modal
      open={open}
      title={<span style={{ color: theme.colors.textPrimary }}>{title}</span>}
      onCancel={onClose}
      footer={null}
      width={900}
      destroyOnClose
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
      ) : (
        <Table<T>
          columns={columns}
          dataSource={data}
          rowKey={rowKey}
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </Modal>
  )
}

export default DrillDownModal
