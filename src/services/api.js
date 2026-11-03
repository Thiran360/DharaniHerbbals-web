export const API_BASE_URL = '/api';
export const BASE_URL = '/api';
export const NGROK_DOMAIN = '/api';
export const getMyOrdersUrl = (userId) => `${API_BASE_URL}/my-orders/${userId}/`;
export const SLIDERS_API_URL = `${API_BASE_URL}/sliders/`;

export const API_HEADERS = {
  'ngrok-skip-browser-warning': 'true'
};

export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  // Rewrite dead or direct backend media URLs first so they route to our proxy /api/media/
  if (trimmed.includes('api.codingboss.in/media/')) {
    return trimmed.replace(/^https?:\/\/api\.codingboss\.in\/media\//i, '/api/media/');
  }
  if (trimmed.includes('179.197.251.47:30080/media/')) {
    return trimmed.replace(/^https?:\/\/179\.197\.251\.47:30080\/media\//i, '/api/media/');
  }

  if (trimmed.startsWith('http://vedanmart.com/')) {
    return trimmed.replace('http://vedanmart.com/', 'https://vedanmart.com/');
  }
  if (trimmed.startsWith('http://www.dharaniherbbals.in/')) {
    return trimmed.replace('http://www.dharaniherbbals.in/', 'https://www.dharaniherbbals.in/');
  }
  if (trimmed.startsWith('http://dharaniherbbals.in/')) {
    return trimmed.replace('http://dharaniherbbals.in/', 'https://dharaniherbbals.in/');
  }
  // Handle backend anomaly: Django prepending MEDIA_URL to external URLs (e.g. /media/https%3A/...)
  if (trimmed.includes('/media/')) {
    const afterMedia = trimmed.split(/\/media\//)[1];
    if (afterMedia && (afterMedia.includes('http%3A') || afterMedia.includes('https%3A') || afterMedia.includes('http:/') || afterMedia.includes('https:/') || afterMedia.includes('vedanmart') || afterMedia.includes('dharaniherbbals'))) {
      let unwrapped = afterMedia;
      try {
        unwrapped = decodeURIComponent(decodeURIComponent(unwrapped));
      } catch (e) {
        try { unwrapped = decodeURIComponent(unwrapped); } catch (e2) {}
      }
      unwrapped = unwrapped.replace(/^https?:\/*/, 'https://').replace(/ /g, '%20');
      if (!unwrapped.startsWith('https://') && (unwrapped.startsWith('vedanmart') || unwrapped.startsWith('www.vedanmart'))) {
        unwrapped = 'https://' + unwrapped;
      }
      return unwrapped;
    }
  }
  if (trimmed.startsWith('/media/')) {
    return `/api${trimmed}`;
  }
  if (trimmed.startsWith('media/')) {
    return `/api/${trimmed}`;
  }
  if (trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.includes('179.197.251.47:30080/media/')) {
    return trimmed.replace(/http:\/\/179\.197\.251\.47:30080\/media\//, '/api/media/');
  }
  if (trimmed.includes('api.codingboss.in/media/')) {
    return trimmed.replace(/https?:\/\/api\.codingboss\.in\/media\//, '/api/media/');
  }
  if (trimmed.includes('179.197.251.47:30080')) {
    return trimmed.replace('http://179.197.251.47:30080/herbal', '/api').replace('http://179.197.251.47:30080', '/api');
  }
  return trimmed;
};
