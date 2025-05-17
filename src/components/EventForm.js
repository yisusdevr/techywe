import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Row, Col } from 'antd';
import moment from 'moment';
import logger from '../utils/logger';

const EventForm = ({ initialValues, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const isEditMode = !!initialValues;
  
  // Log component initialization
  useEffect(() => {
    logger.debug(`EventForm: Inicializado formulario en modo ${isEditMode ? 'edición' : 'creación'}`, { 
      eventId: initialValues?.id
    });

    // Update form when initialValues change
    if (initialValues) {
      logger.debug('EventForm: Estableciendo valores iniciales', { initialValues });
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : null
      });
    }
    
    return () => {
      logger.debug('EventForm: Componente desmontado');
    };
  }, [initialValues, form, isEditMode]);

  // Handle form submission
  const handleSubmit = (values) => {
    logger.info(`EventForm: Formulario enviado en modo ${isEditMode ? 'edición' : 'creación'}`, { 
      formValues: { ...values, date: values.date ? values.date.format('YYYY-MM-DD HH:mm') : null }
    });
    
    const formattedValues = {
      ...values,
      date: values.date ? values.date.toISOString() : new Date().toISOString(),
    };
    
    onSubmit(formattedValues);
  };
  
  // Log field changes if needed (uncomment to activate)
  const handleFieldChange = (changedFields, allFields) => {
    const changedFieldNames = changedFields.map(field => field.name[0]);
    logger.debug('EventForm: Campo(s) modificado(s)', { changedFieldNames });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onFieldsChange={handleFieldChange}
      initialValues={initialValues ? {
        ...initialValues,
        date: initialValues.date ? moment(initialValues.date) : null
      } : undefined}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="title"
            label="Event Title"
            rules={[
              { required: true, message: 'Please enter event title' },
              { min: 3, message: 'Title must be at least 3 characters' },
              { max: 100, message: 'Title cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder="Enter event title" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="date"
            label="Event Date"
            rules={[
              { required: true, message: 'Please select event date' },
              {
                validator: (_, value) => {
                  if (value && value.isBefore(moment().startOf('day'))) {
                    logger.warn('EventForm: Se intentó seleccionar una fecha pasada');
                    return Promise.reject('Event date cannot be in the past');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%' }}
              placeholder="Select date and time"
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              { required: true, message: 'Please enter event location' },
              { max: 200, message: 'Location cannot exceed 200 characters' }
            ]}
          >
            <Input placeholder="Enter event location" />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="organizer"
            label="Organizer"
            rules={[
              { required: true, message: 'Please enter organizer name' },
              { max: 100, message: 'Organizer name cannot exceed 100 characters' }
            ]}
          >
            <Input placeholder="Enter organizer name" />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            name="attendees"
            label="Expected Attendees"
            rules={[
              { required: true, message: 'Please enter expected number of attendees' },
              { type: 'number', min: 0, message: 'Attendees cannot be negative' },
              { type: 'number', max: 10000, message: 'Maximum attendees limit is 10,000' }
            ]}
          >
            <InputNumber 
              placeholder="Enter expected attendees" 
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item
        name="description"
        label="Description"
        rules={[
          { required: true, message: 'Please enter event description' },
          { min: 10, message: 'Description must be at least 10 characters' },
          { max: 2000, message: 'Description cannot exceed 2000 characters' }
        ]}
      >
        <Input.TextArea 
          placeholder="Enter event description" 
          rows={4} 
          showCount
          maxLength={2000}
        />
      </Form.Item>
      
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={loading}
          block
          size="large"
        >
          {isEditMode ? 'Update Event' : 'Create Event'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EventForm;