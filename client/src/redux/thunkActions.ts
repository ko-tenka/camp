import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CamperType, RouteType } from '../types/types';

export const fetchCamper = createAsyncThunk('camper/all', async () => {
  try {
    const response = await axios.get(`http://localhost:3000/camper`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});



export const fetchAdminPlace = createAsyncThunk('Place/add', async (inputs) => {
  const response = await axios.post('http://localhost:3000/admin/place', inputs);
  
  return response.data;
});
  
export const fetchAdminRoute = createAsyncThunk('Route/add', async (inputs) => {
  const response = await axios.post('http://localhost:3000/admin/route', inputs);
  return response.data;
});

export const fetchAdminCamper = createAsyncThunk('Camper/add', async (inputs) => {
  const response = await axios.post('http://localhost:3000/admin/camper', inputs, {withCredentials: true});
  return response.data;
});



export const fetchCamperById = createAsyncThunk('camper/addById', async (id: number) => {
    try {
      const response = await axios.get<CamperType>(`http://localhost:3000/camper/${id}`);
      return response.data; 
    } catch (error) {
      console.log(error);
    }
  }
);


export const fetchBookById = createAsyncThunk('camper/fetchBookById', async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/book/${id}`);
      return response.data; 
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchRoutById = createAsyncThunk('rout/fetchRoutById', async (id: number) => {
    try {
      const response = await axios.get(`http://localhost:3000/rout/${id}`);
      return response.data; 
    } catch (error) {
      console.log(error);
    }
  }
);


export const fetchRoute = createAsyncThunk('route/all', async (obj) => {
  try {
    const response = await axios.post<RouteType>(`http://localhost:3000/allbooking/main`, obj);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});

export const fetchProfileGetBooking= createAsyncThunk('booking/addAll', async () => {
  try {
    const response = await axios.get<RouteType>(`http://localhost:3000/profile/booking/`, { withCredentials: true });
  
    
    return response.data;
   
    
  } catch (error) {
    console.log(error);
  }
});

export const fetchDeleteCard = createAsyncThunk('profileCard/delete', async (id: number) => {
	await axios.delete(`http://localhost:3000/profile/booking/${id}/`);

	return id; 	
	
	
});




export const fetchBook = createAsyncThunk('rout/fetchBook', async (inputs) => {
  try {
    const response = await axios.post(`http://localhost:3000/book/`, inputs, {
      withCredentials: true,
    });
    // console.log('Это response data', response.data)
    return response.data; 
  } catch (error) {
    console.log(error);
  }
}
);