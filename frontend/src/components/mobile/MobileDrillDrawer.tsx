import React, { useEffect, useState } from 'react'
import { Drawer, Table, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { theme } from '../../styles/theme'

interface MobileDrillDrawerProps<T> {
  open: boolean
  title: string
  onClose: () => void
  fetchData: () => Promise<T[]>
  columns: ColumnsType<T>
  rowKey: string | ((record: T) => string)
}

function MobileDrillDrawer<T extends object>({ open, title, onClose, fetchData, columns, rowKey }: MobileDrillDrawerProps<T>) {
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
    <Drawer
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${theme.colors.accentCyan}, ${theme.colors.accentCyan}50)`,
          }} />
          <span style={{ color: theme.colors.textPrimary, fontSize: 14, fontWeight: 600 }}>{title}</span>
        </div>
      }
      placement="bottom"
      height="75vh"
      onClose={onClose}
      destroyOnClose
      styles={{
        header: {
          background: theme.colors.bgCardSolid,
          borderBottom: `1px solid rgba(34, 211, 238, 0.1)`,
          padding: '12px 16px',
        },
        body: {
          background: theme.colors.bgCardSolid,
          padding: '12px 8px',
        },
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><Spin /></div>
      ) : (
        <div className="mobile-table-scroll" style={{ margin: 0, padding: 0 }}>
          <Table<T>
            columns={columns}
            dataSource={data}
            rowKey={rowKey}
            size="small"
            pagination={{ pageSize: 8, simple: true, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}
    </Drawer>
  )
}

export default MobileDrillDrawer
