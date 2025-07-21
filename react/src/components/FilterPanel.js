import React from 'react';
import { Form, Select, Slider, Button, Card } from 'antd';

const { Option } = Select;

const FilterPanel = ({ onFilterChange, filters }) => {
  const [form] = Form.useForm();

  const handleApplyFilters = (values) => {
    onFilterChange({
      gender: values.gender || '',
      minAge: values.ageRange ? values.ageRange[0] : '',
      maxAge: values.ageRange ? values.ageRange[1] : '',
    });
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({ gender: '', minAge: '', maxAge: '' });
  };

  return (
    <Card title="Фильтры" style={{ margin: '20px', maxWidth: '600px' }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          gender: filters.gender || undefined,
          ageRange: filters.minAge && filters.maxAge ? [Number(filters.minAge), Number(filters.maxAge)] : [18, 60],
        }}
        onFinish={handleApplyFilters}
      >
        <Form.Item name="gender" label="Пол">
          <Select placeholder="Выберите пол" allowClear>
            <Option value="male">Мужской</Option>
            <Option value="female">Женский</Option>
          </Select>
        </Form.Item>
        <Form.Item name="ageRange" label="Возрастной диапазон">
          <Slider range min={18} max={100} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
            Применить
          </Button>
          <Button type="default" onClick={handleReset}>
            Сбросить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FilterPanel;
