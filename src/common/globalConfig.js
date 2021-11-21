// Development
export const serverUrl = 'http://192.168.1.76:8090';

// Production
// export const serverUrl = 'http://121.43.149.108:8090';

export const config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, PUT, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
  },
};
