import React, { useEffect, useState } from 'react';
import { Statistic, Card, Row, Col, Spin } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { fetchDashboard } from '@/services/ant-design-pro/api';
import { LoadingOutlined } from '@ant-design/icons';

export default function Dashboard() {
  const [indexInfo, setIndexInfo] = useState(undefined);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  useEffect(async () => {
    const result = await fetchDashboard();
    setIndexInfo(result);
  }, []);

  return (
    <PageContainer>
      {' '}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Spin indicator={antIcon} spinning={indexInfo === undefined}>
              {' '}
              <Statistic
                title="用户数量"
                value={indexInfo?.users_count}
                valueStyle={{ color: '#3f8600' }}
              />
            </Spin>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {' '}
            <Spin indicator={antIcon} spinning={indexInfo === undefined}>
              {' '}
              <Statistic
                title="商品数量"
                value={indexInfo?.goods_count}
                valueStyle={{ color: '#cf1322' }}
              />
            </Spin>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            {' '}
            <Spin indicator={antIcon} spinning={indexInfo === undefined}>
              {' '}
              <Statistic
                title="订单数据"
                value={indexInfo?.order_count}
                valueStyle={{ color: 'skyblue' }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
