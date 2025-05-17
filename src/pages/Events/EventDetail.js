import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Descriptions, Button, Space, 
  Spin, message, Divider, Row, Col, Popconfirm
} from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getEventById, deleteEvent } from '../../services/eventService';
import ErrorAlert from '../../components/ErrorAlert';
import logger from '../../utils/logger';

const { Title, Paragraph } = Typography;

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Log component mount with event ID
  useEffect(() => {
    logger.debug(`EventDetail: Componente montado para evento ID: ${id}`);
    return () => {
      logger.debug(`EventDetail: Componente desmontado para evento ID: ${id}`);
    };
  }, [id]);
  
  // Fetch event details
  const { data: event, isLoading, error, refetch } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getEventById(id),
    onSuccess: (data) => {
      logger.info(`EventDetail: Datos del evento ${id} cargados con éxito`, { 
        title: data.title,
        date: data.date
      });
    },
    onError: (err) => {
      logger.error(`EventDetail: Error al cargar evento ${id}`, { error: err.message });
    }
  });

  // Handle event deletion
  const handleDelete = async () => {
    logger.info(`EventDetail: Intentando eliminar evento con ID: ${id}`);
    try {
      await deleteEvent(id);
      message.success('Event deleted successfully');
      logger.info(`EventDetail: Evento ${id} eliminado con éxito`);
      navigate('/');
    } catch (error) {
      message.error('Failed to delete event');
      logger.error(`EventDetail: Error al eliminar evento ${id}`, { error: error.message });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      logger.debug(`EventDetail: Cargando datos del evento ${id}`);
      return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      );
    }

    if (error) {
      logger.warn(`EventDetail: Mostrando alerta de error para evento ${id}`, { error: error.message });
      return <ErrorAlert error={error} onRetry={refetch} />;
    }

    if (!event) {
      logger.warn(`EventDetail: Evento ${id} no encontrado`);
      return <div>Event not found</div>;
    }

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    logger.debug(`EventDetail: Renderizando detalles del evento ${id}`, { formattedDate });

    return (
      <>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>{event.title}</Title>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary"
                icon={<EditOutlined />} 
                onClick={() => {
                  logger.info(`EventDetail: Navegando a editar evento ${id}`);
                  navigate(`/events/edit/${id}`);
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure you want to delete this event?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                onCancel={() => logger.debug(`EventDetail: Cancelada eliminación del evento ${id}`)}
              >
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>
        
        <Divider />
        
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Date">{formattedDate}</Descriptions.Item>
          <Descriptions.Item label="Location">{event.location}</Descriptions.Item>
          <Descriptions.Item label="Organizer">{event.organizer}</Descriptions.Item>
          <Descriptions.Item label="Attendees">{event.attendees}</Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Title level={4}>Description</Title>
        <Paragraph>{event.description}</Paragraph>
      </>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => {
          logger.info('EventDetail: Navegando de vuelta a la lista de eventos');
          navigate('/');
        }}
        style={{ marginBottom: '16px' }}
      >
        Back to Events
      </Button>
      
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default EventDetail;