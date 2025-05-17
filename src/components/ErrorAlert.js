import React from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const ErrorAlert = ({ error, onRetry }) => {
  return (
    <Alert
      message="Error"
      description={
        <div>
          <p>{error?.message || 'Something went wrong. Please try again.'}</p>
          {onRetry && (
            <Button 
              type="primary" 
              icon={<ReloadOutlined />} 
              onClick={onRetry}
              size="small"
            >
              Retry
            </Button>
          )}
        </div>
      }
      type="error"
      showIcon
    />
  );
};

export default ErrorAlert;