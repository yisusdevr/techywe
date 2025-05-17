import axios from 'axios';
import logger from '../utils/logger';

// Base URL for the mock API
const API_URL = 'https://jsonplaceholder.typicode.com';

// Get all events
export const getEvents = async () => {
  logger.info('Solicitando lista de eventos');
  try {
    // Using posts as mock events
    const response = await axios.get(`${API_URL}/posts`);
    logger.info(`Received ${response.data.length} eventos`, { status: response.status });
    
    const events = response.data.map(post => ({
      id: post.id,
      title: post.title,
      description: post.body,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      location: `Location ${post.id}`,
      organizer: `Organizer ${post.userId}`,
      attendees: Math.floor(Math.random() * 100)
    }));
    
    logger.debug('Proccesed Events', { count: events.length });
    return events;
  } catch (error) {
    logger.error('Error to get vents', { error: error.message, status: error.response?.status });
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id) => {
  logger.info(`Get event with ID: ${id}`);
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    logger.info(`Event ${id} received`, { status: response.status });
    
    const post = response.data;
    const event = {
      id: post.id,
      title: post.title,
      description: post.body,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      location: `Location ${post.id}`,
      organizer: `Organizer ${post.userId}`,
      attendees: Math.floor(Math.random() * 100)
    };
    
    logger.debug('Processed event', { event });
    return event;
  } catch (error) {
    logger.error(`Error with get event with ID ${id}`, { error: error.message, status: error.response?.status });
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  logger.info('Create new event', { eventData });
  try {
    const response = await axios.post(`${API_URL}/posts`, eventData);
    logger.info('Evento created ', { status: response.status, id: response.data.id });
    return response.data;
  } catch (error) {
    logger.error('Error created event', { error: error.message, status: error.response?.status });
    console.error('Error creating event:', error);
    throw error;
  }
};

// Update an existing event
export const updateEvent = async (id, eventData) => {
  logger.info(`Update event with ID  ${id}`, { eventData });
  try {
    const response = await axios.put(`${API_URL}/posts/${id}`, eventData);
    logger.info(`Event ${id} updated `, { status: response.status });
    return response.data;
  } catch (error) {
    logger.error(`Error with update event with ID ${id}`, { error: error.message, status: error.response?.status });
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id) => {
  logger.info(`Deleted event with ID: ${id}`);
  try {
    const response = await axios.delete(`${API_URL}/posts/${id}`);
    logger.info(`Event ${id} DELETED`, { status: response.status });
    return response.data;
  } catch (error) {
    logger.error(`Error to delete the event with ID ${id}`, { error: error.message, status: error.response?.status });
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
};