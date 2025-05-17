import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Typography, Button, message, Spin, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import EventForm from '../../components/EventForm';
import { getEventById, updateEvent } from '../../services/eventService';
import ErrorAlert from '../../components/ErrorAlert';
import logger from '../../utils/logger';

const { Title } = Typography;

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Log component mount
  useEffect(() => {
    logger.debug(`EditEvent: Componente montado para evento ID: ${id}`);
    return () => {
      logger.debug(`EditEvent: Componente desmontado para evento ID: ${id}`);
    };
  }, [id]);
  
  // Fetch event data
  const { 
    data: event, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    onSuccess: (data) => {
      logger.info(`EditEvent: Datos del evento ${id} cargados para edición`, { 
        title: data.title,
        date: data.date
      });
    },
    onError: (err) => {
      logger.error(`EditEvent: Error al cargar evento ${id} para edición`, { 
        error: err.message 
      });
    }
  });

  // Update event mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (formData) => updateEvent(id, formData),
    onSuccess: () => {
      logger.info(`EditEvent: Evento ${id} actualizado con éxito`);
      message.success('Event updated successfully');
      navigate(`/events/${id}`);
    },
    onError: (error) => {
      logger.error(`EditEvent: Error al actualizar evento ${id}`, { 
        error: error.message 
      });
      message.error('Failed to update event: ' + error.message);
    }
  });

  const handleSubmit = (formData) => {
    logger.info(`EditEvent: Enviando cambios para evento ${id}`, { 
      title: formData.title,
      date: formData.date
    });
    mutate(formData);
  };

  const renderContent = () => {
    if (isLoading) {
      logger.debug(`EditEvent: Cargando datos del evento ${id} para edición`);
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      logger.warn(`EditEvent: Error al cargar evento ${id} para edición`, { 
        error: error.message 
      });
      return <ErrorAlert error={error} onRetry={refetch} />;
    }

    logger.debug(`EditEvent: Renderizando formulario para editar evento ${id}`);
    return (
      <>
        <Title level={2}>Edit Event</Title>
        
        <EventForm
          initialValues={event}
          onSubmit={handleSubmit}
          loading={isPending}
        />
      </>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => {
          logger.info(`EditEvent: Cancelando edición y regresando a detalles de evento ${id}`);
          navigate(`/events/${id}`);
        }}
        style={{ marginBottom: '16px' }}
      >
        Back to Event Details
      </Button>
      
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default EditEvent;