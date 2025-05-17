import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../utils/ThemeContext';

const ThemeSwitch = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Switch
      checked={darkMode}
      onChange={toggleTheme}
      checkedChildren={<BulbFilled />}
      unCheckedChildren={<BulbOutlined />}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    />
  );
};

export default ThemeSwitch;