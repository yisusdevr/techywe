import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Typography, Button, message, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import EventForm from '../../components/EventForm';
import { createEvent } from '../../services/eventService';
import logger from '../../utils/logger';

const { Title } = Typography;

const AddEvent = () => {
  const navigate = useNavigate();
  
  // Log component mount
  useEffect(() => {
    logger.debug('AddEvent: Componente montado');
    return () => {
      logger.debug('AddEvent: Componente desmontado');
    };
  }, []);
  
  const { mutate, isPending } = useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      logger.info('AddEvent: Evento creado con éxito', { 
        eventId: data.id 
      });
      message.success('Event created successfully');
      navigate('/');
    },
    onError: (error) => {
      logger.error('AddEvent: Error al crear evento', { 
        error: error.message 
      });
      message.error('Failed to create event: ' + error.message);
    }
  });

  const handleSubmit = (formData) => {
    logger.info('AddEvent: Enviando datos para crear evento', { 
      title: formData.title,
      date: formData.date
    });
    mutate(formData);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => {
          logger.info('AddEvent: Cancelando creación y regresando a lista');
          navigate('/');
        }}
        style={{ marginBottom: '16px' }}
      >
        Back to Events
      </Button>
      
      <Card>
        <Title level={2}>Add New Event</Title>
        
        <EventForm
          onSubmit={handleSubmit}
          loading={isPending}
        />
      </Card>
    </div>
  );
};

export default AddEvent;