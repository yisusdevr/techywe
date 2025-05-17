import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, Space, Button, Input, Typography, 
  message, Popconfirm, Card, Tag, Row, Col, Empty 
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent } from '../../services/eventService';
import ErrorAlert from '../../components/ErrorAlert';
import logger from '../../utils/logger';

const { Title } = Typography;

const EventsList = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  
  // Log component mount
  useEffect(() => {
    logger.debug('EventsList: Componente montado');
    return () => {
      logger.debug('EventsList: Componente desmontado');
    };
  }, []);
  
  // Fetch events data
  const { data: events = [], isLoading, error, refetch } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    onSuccess: (data) => {
      logger.info('EventsList: Datos de eventos cargados con éxito', { count: data.length });
    },
    onError: (err) => {
      logger.error('EventsList: Error al cargar eventos', { error: err.message });
    }
  });

  // Handle event deletion
  const handleDelete = async (id) => {
    logger.info(`EventsList: Intentando eliminar evento con ID: ${id}`);
    try {
      await deleteEvent(id);
      message.success('Event deleted successfully');
      logger.info(`EventsList: Evento ${id} eliminado con éxito`);
      refetch();
    } catch (error) {
      message.error('Failed to delete event');
      logger.error(`EventsList: Error al eliminar evento ${id}`, { error: error.message });
    }
  };

  // Search handler
  const handleSearch = (value) => {
    setSearchText(value);
    logger.debug('EventsList: Búsqueda actualizada', { searchText: value });
  };

  // Filter events based on search text
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchText.toLowerCase()) ||
    event.description.toLowerCase().includes(searchText.toLowerCase()) ||
    event.location.toLowerCase().includes(searchText.toLowerCase()) ||
    event.organizer.toLowerCase().includes(searchText.toLowerCase())
  );

  logger.debug('EventsList: Eventos filtrados', { 
    totalEvents: events.length,
    filteredCount: filteredEvents.length,
    searchCriteria: searchText || 'ninguno'
  });

  // Table columns definition
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <Link to={`/events/${record.id}`}>{text}</Link>,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      responsive: ['md'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['lg'],
    },
    {
      title: 'Organizer',
      dataIndex: 'organizer',
      key: 'organizer',
      responsive: ['lg'],
    },
    {
      title: 'Attendees',
      dataIndex: 'attendees',
      key: 'attendees',
      render: (attendees) => (
        <Tag color={attendees > 50 ? 'green' : 'blue'}>{attendees}</Tag>
      ),
      sorter: (a, b) => a.attendees - b.attendees,
      responsive: ['sm'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<EyeOutlined />} 
            onClick={() => {
              logger.info(`EventsList: Navegando a detalles del evento ${record.id}`);
              navigate(`/events/${record.id}`);
            }}
            title="View Event"
          />
          <Button 
            icon={<EditOutlined />} 
            onClick={() => {
              logger.info(`EventsList: Navegando a editar evento ${record.id}`);
              navigate(`/events/edit/${record.id}`);
            }}
            title="Edit Event"
          />
          <Popconfirm
            title="Are you sure you want to delete this event?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            onCancel={() => logger.debug(`EventsList: Cancelada eliminación del evento ${record.id}`)}
          >
            <Button danger icon={<DeleteOutlined />} title="Delete Event" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderContent = () => {
    if (error) {
      logger.warn('EventsList: Mostrando alerta de error', { error: error.message });
      return <ErrorAlert error={error} onRetry={refetch} />;
    }

    return (
      <>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>Events Management</Title>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                logger.info('EventsList: Navegando a crear nuevo evento');
                navigate('/events/add');
              }}
            >
              Add Event
            </Button>
          </Col>
        </Row>
        
        <Input
          placeholder="Search events by title, description, location or organizer"
          prefix={<SearchOutlined />}
          style={{ marginBottom: 16 }}
          value={searchText}
          onChange={e => handleSearch(e.target.value)}
          allowClear
        />
        
        {filteredEvents.length === 0 && !isLoading ? (
          <Empty 
            description={searchText ? "No events match your search" : "No events found"} 
            style={{ margin: '50px 0' }}
          />
        ) : (
          <Table
            dataSource={filteredEvents}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} events`,
              onChange: (page) => logger.debug('EventsList: Cambio de página', { page }),
              onShowSizeChange: (current, size) => logger.debug('EventsList: Cambio de tamaño por página', { current, size })
            }}
            scroll={{ x: 'max-content' }}
            onChange={(pagination, filters, sorter) => {
              logger.debug('EventsList: Cambio en la tabla', { 
                pagination, 
                filters, 
                sorter: sorter.field ? { field: sorter.field, order: sorter.order } : 'none' 
              });
            }}
          />
        )}
      </>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card>{renderContent()}</Card>
    </div>
  );
};

export default EventsList;